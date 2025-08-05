import { useState } from "react";
import { Box, VStack, HStack, Button, Text, Textarea, Alert, AlertIcon } from "@chakra-ui/react";
import { MainPageTemplate } from "../../components/templates/main";

export default function DebugTest() {
  const [testMessage, setTestMessage] = useState("Test message");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (step, data, error = null) => {
    setResults(prev => [...prev, {
      step,
      data,
      error,
      timestamp: new Date().toISOString()
    }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testBackendHealth = async () => {
    setIsLoading(true);
    addResult("Starting backend health check...");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/healthcheck/`);
      addResult("Backend health response status", response.status);
      
      if (response.ok) {
        const data = await response.text();
        addResult("Backend health response", data);
      } else {
        addResult("Backend health error", null, `Status: ${response.status}`);
      }
    } catch (error) {
      addResult("Backend health error", null, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testChatbotEndpoint = async () => {
    setIsLoading(true);
    addResult("Starting chatbot endpoint test...");
    
    try {
      // Test if the chatbot endpoint exists
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chatbot/threads/`);
      addResult("Chatbot endpoint response status", response.status);
      addResult("Chatbot endpoint response headers", Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.text();
        addResult("Chatbot endpoint response", data);
      } else {
        addResult("Chatbot endpoint error", null, `Status: ${response.status}`);
      }
    } catch (error) {
      addResult("Chatbot endpoint error", null, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testTokenBridge = async () => {
    setIsLoading(true);
    addResult("Starting token bridge test...");
    
    try {
      // Get token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        addResult("Token bridge error", null, "No token found in cookies");
        return;
      }

      addResult("Token found", "Token extracted from cookies");

      // Test token bridge
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chatbot/token-from-main/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          main_token: token
        }),
      });

      addResult("Token bridge response status", response.status);
      addResult("Token bridge response headers", Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        addResult("Token bridge success", data);
        return data.access;
      } else {
        const errorText = await response.text();
        addResult("Token bridge error response", errorText);
        return null;
      }
    } catch (error) {
      addResult("Token bridge error", null, error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const testChatbotWithAuth = async () => {
    setIsLoading(true);
    addResult("Starting authenticated chatbot test...");
    
    try {
      // First get a chatbot token
      const chatbotToken = await testTokenBridge();
      
      if (!chatbotToken) {
        addResult("Authenticated test error", null, "Failed to get chatbot token");
        return;
      }

      // Test chatbot endpoint with authentication
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chatbot/threads/`, {
        headers: {
          'Authorization': `Bearer ${chatbotToken}`,
          'Content-Type': 'application/json',
        },
      });

      addResult("Authenticated chatbot response status", response.status);
      addResult("Authenticated chatbot response headers", Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        addResult("Authenticated chatbot response", data);
      } else {
        const errorText = await response.text();
        addResult("Authenticated chatbot error", errorText);
      }
    } catch (error) {
      addResult("Authenticated chatbot error", null, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testAuth = async () => {
    setIsLoading(true);
    addResult("Starting auth test...");
    
    try {
      // Get user data from cookies
      const userBD = document.cookie
        .split('; ')
        .find(row => row.startsWith('userBD='))
        ?.split('=')[1];
      
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      addResult("Cookies found", { userBD: userBD ? 'present' : 'missing', token: token ? 'present' : 'missing' });

      if (!userBD || !token) {
        addResult("Auth test error", null, "Missing userBD or token cookies");
        return;
      }

      const user = JSON.parse(decodeURIComponent(userBD));
      addResult("User data parsed", user);

      // Extract the numeric ID from the user.id (e.g., "AccountNode:4" -> "4")
      const reg = new RegExp("(?<=:).*");
      const [id] = reg.exec(user.id);
      addResult("User ID extracted", id);

      // Call getUser API with proper parameters
      const response = await fetch(`/api/user/getUser?p=${btoa(id)}&q=${btoa(token)}`);
      addResult("getUser response status", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        addResult("getUser error response", errorText);
        return;
      }

      const data = await response.json();
      addResult("Auth test result", data);
    } catch (error) {
      addResult("Auth test error", null, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testThreads = async () => {
    setIsLoading(true);
    addResult("Starting threads test...");
    
    try {
      const response = await fetch('/api/chatbot/threads');
      const data = await response.json();
      addResult("Threads test result", data);
    } catch (error) {
      addResult("Threads test error", null, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateThread = async () => {
    setIsLoading(true);
    addResult("Starting create thread test...");
    
    try {
      const response = await fetch('/api/chatbot/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: "Debug Test Thread" }),
      });
      const data = await response.json();
      addResult("Create thread result", data);
      return data.id;
    } catch (error) {
      addResult("Create thread error", null, error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const testSendMessage = async (threadId) => {
    setIsLoading(true);
    addResult("Starting send message test...");
    
    try {
      const response = await fetch(`/api/chatbot/messages?thread_id=${threadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          content: testMessage,
        }),
      });

      addResult("Send message response status", response.status);
      addResult("Send message response headers", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        addResult("Send message error response", errorData);
        return;
      }

      // Try to read the response as text first
      const text = await response.text();
      addResult("Send message response text", text);

      // If it looks like JSON, try to parse it
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        try {
          const jsonData = JSON.parse(text);
          addResult("Send message JSON response", jsonData);
        } catch (e) {
          addResult("Send message JSON parse error", null, e.message);
        }
      }

    } catch (error) {
      addResult("Send message error", null, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testSendMessageSimple = async (threadId) => {
    setIsLoading(true);
    addResult("Starting simple send message test...");
    
    try {
      // First, let's test if we can get a simple response without streaming
      const response = await fetch(`/api/chatbot/messages?thread_id=${threadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          content: "Hello, this is a simple test message",
        }),
      });

      addResult("Simple send message response status", response.status);
      addResult("Simple send message response headers", Object.fromEntries(response.headers.entries()));

      // Read the response as text
      const text = await response.text();
      addResult("Simple send message response text", text);

      // Check if it contains the error message you mentioned
      if (text.includes("Ops, algo deu errado")) {
        addResult("Found error message in response", "The backend is returning an error message");
      }

      // Try to parse as JSON if it looks like JSON
      try {
        const jsonData = JSON.parse(text);
        addResult("Simple send message JSON response", jsonData);
      } catch (e) {
        addResult("Simple send message not JSON", "Response is not valid JSON");
      }

    } catch (error) {
      addResult("Simple send message error", null, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateAndSendMessage = async () => {
    setIsLoading(true);
    addResult("Starting create thread and send message test...");
    
    try {
      // Step 1: Create a thread
      addResult("Step 1: Creating thread...");
      const createResponse = await fetch('/api/chatbot/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: "Debug Test Thread" }),
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        addResult("Create thread error", errorData);
        return;
      }
      
      const threadData = await createResponse.json();
      addResult("Thread created successfully", threadData);
      
      const threadId = threadData.id;
      addResult("Thread ID extracted", threadId);
      
      // Step 2: Send a message to the thread
      addResult("Step 2: Sending message...");
      const messageResponse = await fetch(`/api/chatbot/messages?thread_id=${threadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          content: "Hello, this is a test message",
        }),
      });

      addResult("Message response status", messageResponse.status);
      addResult("Message response headers", Object.fromEntries(messageResponse.headers.entries()));

      // Read the response as text
      const text = await messageResponse.text();
      addResult("Message response text", text);

      // Check if it contains the error message you mentioned
      if (text.includes("Ops, algo deu errado")) {
        addResult("Found error message in response", "The backend is returning an error message");
      }

    } catch (error) {
      addResult("Create and send message error", null, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const runFullTest = async () => {
    clearResults();
    addResult("Starting full test sequence...");
    
    // Test 1: Auth
    await testAuth();
    
    // Test 2: Get threads
    await testThreads();
    
    // Test 3: Create thread
    const threadId = await testCreateThread();
    
    if (threadId) {
      // Test 4: Send message
      await testSendMessage(threadId);
    }
    
    addResult("Full test sequence completed");
  };

  return (
    <MainPageTemplate>
      <Box maxWidth="1200px" margin="0 auto" padding={6}>
        <VStack spacing={6} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">Chatbot Debug Test</Text>
          
          <Box>
            <Text fontWeight="bold" marginBottom={2}>Test Message:</Text>
            <Textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test message..."
              marginBottom={4}
            />
          </Box>

          <VStack spacing={4}>
            <HStack spacing={4}>
              <Button onClick={testBackendHealth} isLoading={isLoading} colorScheme="teal">
                Test Backend Health
              </Button>
              <Button onClick={testChatbotEndpoint} isLoading={isLoading} colorScheme="cyan">
                Test Chatbot Endpoint
              </Button>
              <Button onClick={testTokenBridge} isLoading={isLoading} colorScheme="yellow">
                Test Token Bridge
              </Button>
              <Button onClick={testChatbotWithAuth} isLoading={isLoading} colorScheme="pink">
                Test Chatbot with Auth
              </Button>
            </HStack>
            
            <HStack spacing={4}>
              <Button onClick={testAuth} isLoading={isLoading} colorScheme="blue">
                Test Auth
              </Button>
              <Button onClick={testThreads} isLoading={isLoading} colorScheme="green">
                Test Threads
              </Button>
              <Button onClick={testCreateThread} isLoading={isLoading} colorScheme="orange">
                Test Create Thread
              </Button>
              <Button onClick={testCreateAndSendMessage} isLoading={isLoading} colorScheme="red">
                Test Create & Send Message
              </Button>
            </HStack>
            
            <HStack spacing={4}>
              <Button onClick={runFullTest} isLoading={isLoading} colorScheme="purple">
                Run Full Test
              </Button>
              <Button onClick={clearResults} colorScheme="gray">
                Clear Results
              </Button>
            </HStack>
          </VStack>

          <Box>
            <Text fontWeight="bold" marginBottom={2}>Test Results:</Text>
            <Box 
              maxHeight="600px" 
              overflowY="auto" 
              border="1px solid #E2E8F0" 
              borderRadius="8px" 
              padding={4}
              backgroundColor="#F7FAFC"
            >
              {results.length === 0 ? (
                <Text color="#616161">No test results yet. Run a test to see results here.</Text>
              ) : (
                <VStack spacing={3} align="stretch">
                  {results.map((result, index) => (
                    <Box 
                      key={index} 
                      border="1px solid #E2E8F0" 
                      borderRadius="6px" 
                      padding={3}
                      backgroundColor="white"
                    >
                      <Text fontWeight="bold" color="#3182CE" fontSize="sm">
                        {result.step}
                      </Text>
                      <Text fontSize="xs" color="#616161" marginTop={1}>
                        {result.timestamp}
                      </Text>
                      {result.error ? (
                        <Alert status="error" marginTop={2} borderRadius="4px">
                          <AlertIcon />
                          <Text fontSize="sm">{result.error}</Text>
                        </Alert>
                      ) : result.data && (
                        <Box marginTop={2}>
                          <Text fontSize="xs" color="#616161" marginBottom={1}>
                            Response:
                          </Text>
                          <Box 
                            backgroundColor="#2D3748" 
                            color="white" 
                            padding={2} 
                            borderRadius="4px"
                            fontSize="xs"
                            fontFamily="monospace"
                            overflowX="auto"
                          >
                            <pre>{JSON.stringify(result.data, null, 2)}</pre>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </Box>
        </VStack>
      </Box>
    </MainPageTemplate>
  );
} 