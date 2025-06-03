import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getAuthToken(email, password) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        mutation {
          authToken (input: { email: "${email}", password: "${password}" }) {
            user {
              email
              id
            }
            token
          }
        }`
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get auth token" };
  }
}

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
            allAccount (id: "${id}"){
              edges {
                node {
                  id
                  isAdmin
                  isActive
                  isEmailVisible
                  gcpEmail
                  picture
                  username
                  firstName
                  lastName
                  email
                  website
                  github
                  twitter
                  linkedin
                  workDataTool
                  availableForResearch
                  isSubscriber
                  proSubscription
                  proSubscriptionRole
                  proSubscriptionSlots
                  subscriptionSet (isActive: true) {
                    edges {
                      node {
                        canceledAt
                        createdAt
                        planInterval
                      }
                    }
                  }
                  internalSubscription (isActive: true, first: 1) {
                    edges {
                      node {
                        canceledAt
                        createdAt
                        isActive
                        stripeSubscription
                        planInterval
                        nextBillingCycle
                      }
                    }
                  }
                }
              }
            }
          }
        `
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return { error: "Failed to get user data" };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = atob(req.query.a);
    const password = atob(req.query.p);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const authResponse = await getAuthToken(email, password);
    if (authResponse.error || !authResponse.data?.authToken) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const { token, user } = authResponse.data.authToken;
    const userId = user.id;

    const userDataResponse = await getUserData(userId, token);

    if (userDataResponse.error) {
      return res.status(500).json({ error: "Failed to fetch user data" });
    }

    const userData = userDataResponse.data?.allAccount?.edges[0]?.node;

    const response = {
      authToken: token,
      user: userData
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in combined auth handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}