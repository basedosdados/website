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
    const { message_pair_id } = req.query;
    
    if (!message_pair_id) {
      return res.status(400).json({ error: 'Message pair ID is required' });
    }

    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = await getAuthToken(req);
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Submit feedback
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/chatbot/message-pairs/${message_pair_id}/feedbacks/`,
      req.body,
      { headers }
    );
    
    return res.status(200).json(response.data);

  } catch (error) {
    console.error('Chatbot feedback error:', error);
    
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
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
} 