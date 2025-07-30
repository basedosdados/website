import axios from "axios";

const CHATBOT_BASE_URL = "http://localhost:8000";

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

  // Get current user data from the main website
  const userDataResponse = await axios({
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
              }
            }
          }
        }
      `
    }
  });

  if (userDataResponse.data.errors) {
    throw new Error('Invalid token');
  }

  const userData = userDataResponse.data.data.allAccount.edges[0]?.node;
  
  if (!userData) {
    throw new Error('User not found');
  }
  
  // TODO: Implement proper chatbot access control
  // - Add has_chatbot_access field to the GraphQL query above
  // - Check if userData.has_chatbot_access is true
  // - Throw error if user doesn't have access

  // TODO: Implement proper token bridging between main website and chatbot backend
  // - The chatbot backend currently requires its own authentication system
  // - Need to either:
  //   1. Modify chatbot backend to accept main website's JWT tokens
  //   2. Create a token bridge endpoint in chatbot backend
  //   3. Use shared authentication secrets between both systems

  // For now, return the main website's token
  // This will likely fail with the chatbot backend until token bridging is implemented
  return token;
}

export default async function handler(req, res) {
  try {
    const { threadId } = req.query;
    
    if (!threadId) {
      return res.status(400).json({ error: 'Thread ID is required' });
    }

    const token = await getAuthToken(req);
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    if (req.method === 'DELETE') {
      // Delete thread
      const response = await axios.delete(
        `${CHATBOT_BASE_URL}/chatbot/threads/${threadId}/`,
        { headers }
      );
      
      return res.status(204).end();

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Chatbot thread delete error:', error);
    
    if (error.message === 'Not authenticated') {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (error.message === 'User not found') {
      return res.status(403).json({ error: 'User not found' });
    }

    if (error.message === 'Invalid token') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Handle chatbot backend authentication errors
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ 
        error: 'Chatbot authentication failed',
        message: 'The chatbot backend requires its own authentication system. Token bridging needs to be implemented.',
        details: error.response.data
      });
    }

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
} 