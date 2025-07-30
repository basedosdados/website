import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getUserData(id, token) {
  try {
    const res = await axios({
      url: API_URL,
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
    })
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userBD = req.cookies.userBD;
    const token = req.cookies.token;
    
    if (!userBD || !token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = JSON.parse(userBD);

    // Extract the numeric ID from the user.id (e.g., "AccountNode:4" -> "4")
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(user.id)

    const result = await getUserData(id, token)

    if(result.errors) return res.status(500).json({error: result.errors})
    if(result === "err") return res.status(500).json({error: "err"})

    const userData = result.data.allAccount.edges[0]?.node;
    
    if (!userData) {
      return res.status(403).json({ error: 'User not found' });
    }

    // TODO: Implement proper chatbot access control
    // - Add has_chatbot_access field to the GraphQL query above
    // - Check if userData.has_chatbot_access is true
    // - Return 403 if user doesn't have access

    // TODO: Implement proper token bridging between main website and chatbot backend
    // - The chatbot backend currently requires its own authentication system
    // - Need to either:
    //   1. Modify chatbot backend to accept main website's JWT tokens
    //   2. Create a token bridge endpoint in chatbot backend
    //   3. Use shared authentication secrets between both systems

    // For now, allow any authenticated user to access the chatbot
    // This is a temporary solution for testing purposes
    return res.status(200).json({ 
      success: true, 
      user: { ...user, has_chatbot_access: true },
      token: token 
    });

  } catch (error) {
    console.error('Chatbot auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 