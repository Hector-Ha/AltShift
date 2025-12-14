const { readFileSync } = require("fs");
const { resolve } = require("path");

const LOGIN_QUERY = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

const CREATE_WITH_AI_QUERY = `
  mutation CreateDocumentWithAI($prompt: String!, $attachments: [AttachmentInput]) {
    createDocumentWithAI(prompt: $prompt, attachments: $attachments) {
      id
      title
      content
    }
  }
`;

async function testAttachment() {
  try {
    // 1. Login
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
    console.log("Logged in, token:", token.substring(0, 10) + "...");

    // 2. Read PDF File
    const filePath = resolve(__dirname, "../test-context.pdf");
    const fileBuffer = readFileSync(filePath);
    const base64Content = fileBuffer.toString("base64");

    const attachments = [
      {
        name: "test-context.pdf",
        content: base64Content,
        mimeType: "application/pdf",
      },
    ];

    // 3. Call Mutation
    console.log("Sending AI request with PDF attachment...");
    const aiRes = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: CREATE_WITH_AI_QUERY,
        variables: {
          prompt: "What is the moon base made of?",
          attachments: attachments,
        },
      }),
    });

    const aiData = await aiRes.json();
    if (aiData.errors) throw new Error(JSON.stringify(aiData.errors));

    console.log("AI Response Document:", aiData.data.createDocumentWithAI);
  } catch (error) {
    console.error("Test Failed:", error);
  }
}

testAttachment();
