const { readFileSync } = require("fs");
const { resolve } = require("path");

const LOGIN_QUERY = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const CREATE_WITH_AI_QUERY = `
  mutation CreateDocumentWithAI($prompt: String!, $attachments: [AttachmentInput]) {
    createDocumentWithAI(prompt: $prompt, attachments: $attachments) {
      id
      title
    }
  }
`;

async function testAiHtml() {
  try {
    console.log("Logging in...");
    const loginRes = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LOGIN_QUERY,
        variables: { email: "user1@gmail.com", password: "user1" },
      }),
    });

    const loginData = await loginRes.json();
    if (loginData.errors) throw new Error(JSON.stringify(loginData.errors));
    const token = loginData.data.login.token;

    // Read prompt.txt
    const filePath = resolve(__dirname, "../prompt.txt");
    const fileBuffer = readFileSync(filePath);
    const base64Content = fileBuffer.toString("base64");

    const attachments = [
      {
        name: "prompt.txt",
        content: base64Content,
        mimeType: "text/plain",
      },
    ];

    console.log("Sending AI request (prompt.txt)...");
    const aiRes = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: CREATE_WITH_AI_QUERY,
        variables: {
          prompt: "", // Empty prompt, relying on attachment
          attachments: attachments,
        },
      }),
    });

    const aiData = await aiRes.json();
    if (aiData.errors) throw new Error(JSON.stringify(aiData.errors));

    console.log("AI Response:", aiData.data.createDocumentWithAI);
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

testAiHtml();
