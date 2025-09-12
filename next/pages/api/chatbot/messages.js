import axios from "axios";

async function getAuthToken(req) {
  const userBD = req.cookies.userBD;
  const token = req.cookies.token;
  
  if (!userBD || !token) {
    throw new Error('Not authenticated');
  }

  const user = JSON.parse(userBD);

  // Extract the numeric ID from the user.id (e.g., "AccountNode:4" -> "4")
  const reg = new RegExp("(?<=:).*")
  const [ id ] = reg.exec(user.id)

  // Check user access through GraphQL API directly
  const userResponse = await axios({
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      query: `
        query {
          allAccount (id: "${id}") {
            edges {
              node {
                id
                email
                username
                hasChatbotAccess
              }
            }
          }
        }
      `
    }
  });

  if (userResponse.data.errors) {
    throw new Error('Invalid token');
  }

  const userData = userResponse.data.data.allAccount.edges[0]?.node;
  
  if (!userData) {
    throw new Error('User not found');
  }

  // Check if user has chatbot access
  if (!userData.hasChatbotAccess) {
    throw new Error('Access denied');
  }

  // Use token bridge to get chatbot-compatible token
  try {
    const tokenBridgeResponse = await axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/chatbot/token-from-main/`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        main_token: token
      }
    });

    return tokenBridgeResponse.data.access;
  } catch (tokenBridgeError) {
    console.error('Token bridge error:', tokenBridgeError.response?.data || tokenBridgeError.message);
    throw new Error('Chatbot authentication failed');
  }
}

export default async function handler(req, res) {
  try {
    const { thread_id } = req.query;
    
    if (!thread_id) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }


    const token = await getAuthToken(req);
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    if (req.method === 'GET') {
      // Get messages for a thread
      const orderBy = req.query.order_by || 'created_at';
      const url = `${process.env.NEXT_PUBLIC_API_URL}/chatbot/threads/${thread_id}/messages/?order_by=${orderBy}`;
      
      const response = await axios.get(url, { headers });
      
      return res.status(200).json(response.data);

    } else if (req.method === 'POST') {
      // Send message with streaming
      
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/chatbot/threads/${thread_id}/messages/`,
          req.body,
          { 
            headers,
            responseType: 'stream',
            validateStatus: function (status) {
              return status < 500; // Resolve only if the status code is less than 500
            }
          }
        );
        
        
        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        
        // Convert backend's raw JSON lines to SSE format
        let buffer = '';
        
        response.data.on('data', (chunk) => {
          buffer += chunk.toString();
          
          // Process complete lines
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (line.trim()) {
              try {
                // Backend sends raw JSON, we need to format as SSE
                const jsonData = JSON.parse(line.trim());
                res.write(`data: ${JSON.stringify(jsonData)}\n\n`);
              } catch (parseError) {
                console.error('Messages API - Error parsing backend JSON:', parseError);
                // Send the raw line if it can't be parsed
                res.write(`data: ${line.trim()}\n\n`);
              }
            }
          }
        });
        
        response.data.on('end', () => {
          // Process any remaining data in buffer
          if (buffer.trim()) {
            try {
              const jsonData = JSON.parse(buffer.trim());
              res.write(`data: ${JSON.stringify(jsonData)}\n\n`);
            } catch (parseError) {
              console.error('Messages API - Error parsing final buffer:', parseError);
            }
          }
          
          // Send done signal
          res.write('data: [DONE]\n\n');
          res.end();
        });
        
        response.data.on('error', (streamError) => {
          console.error('Messages API - Stream error:', streamError);
          res.write(`data: ${JSON.stringify({error: 'Stream error', message: streamError.message})}\n\n`);
          res.end();
        });
        
      } catch (streamError) {
        console.error('Messages API - Streaming error:', streamError);
        console.error('Messages API - Streaming error response:', streamError.response?.data);
        console.error('Messages API - Streaming error status:', streamError.response?.status);
        
        // If streaming fails, try to get the error message
        if (streamError.response?.data) {
          let errorText = '';
          
          // Check if it's a stream or regular response
          if (typeof streamError.response.data.getReader === 'function') {
            // It's a stream, try to read it
            const errorReader = streamError.response.data.getReader();
            const decoder = new TextDecoder();
            
            try {
              while (true) {
                const { done, value } = await errorReader.read();
                if (done) break;
                errorText += decoder.decode(value);
              }
            } catch (readError) {
              console.error('Messages API - Error reading error stream:', readError);
            }
          } else {
            // It's a regular response, try to get the text
            try {
              if (typeof streamError.response.data === 'string') {
                errorText = streamError.response.data;
              } else {
                errorText = JSON.stringify(streamError.response.data);
              }
            } catch (parseError) {
              console.error('Messages API - Error parsing response data:', parseError);
              errorText = streamError.message;
            }
          }
          
          return res.status(streamError.response.status || 500).json({ 
            error: 'Backend error',
            message: errorText || streamError.message,
            status: streamError.response.status
          });
        }
        
        // If no response data, return the error message
        return res.status(500).json({ 
          error: 'Backend error',
          message: streamError.message
        });
      }

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Chatbot messages error:', error);
    console.error('Chatbot messages error message:', error.message);
    console.error('Chatbot messages error response:', error.response?.data);
    console.error('Chatbot messages error status:', error.response?.status);
    
    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (error.message === 'User not found') {
      return res.status(403).json({ error: 'User not found' });
    }

    if (error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (error.message === 'Access denied') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (error.message === 'Chatbot authentication failed') {
      return res.status(401).json({ 
        error: 'Chatbot authentication failed',
        message: 'Failed to authenticate with chatbot backend'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Backend error',
        message: error.response.data,
        status: error.response.status
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
} 