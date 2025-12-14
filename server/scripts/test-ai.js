// Use global fetch
async function testMutation() {
  const query = `
    mutation CreateDocumentWithAI($prompt: String!) {
      createDocumentWithAI(prompt: $prompt) {
        id
        title
        content
      }
    }
  `;

  const variables = {
    prompt: "Test Project Proposal",
  };

  try {
    console.log("Starting test...");
    // 1. Login
    const loginQuery = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `;

    const loginRes = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: loginQuery,
        variables: { email: "user1@gmail.com", password: "user1" },
      }),
    });

    // Check if fetch failed (network error)
    if (!loginRes.ok) {
      console.error(
        "Login Fetch failed:",
        loginRes.status,
        loginRes.statusText
      );
      const text = await loginRes.text();
      console.error("Response:", text);
      return;
    }

    const loginData = await loginRes.json();
    if (loginData.errors) {
      console.error(
        "Login GraphQL Error:",
        JSON.stringify(loginData.errors, null, 2)
      );
      return;
    }

    const token = loginData.data?.login?.token;
    if (!token) {
      console.error("No token in response:", loginData);
      return;
    }
    console.log("Logged in, token received.");

    // 2. Test AI Mutation
    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!res.ok) {
      console.error("Mutation Fetch failed:", res.status, res.statusText);
      const text = await res.text();
      console.error("Response:", text);
      return;
    }

    const data = await res.json();
    if (data.errors) {
      console.error("Mutation Error:", JSON.stringify(data.errors, null, 2));
    } else {
      console.log("Mutation Success:", JSON.stringify(data.data, null, 2));
    }
  } catch (err) {
    console.error("Request failed:", err);
  }
}

(async () => {
  await testMutation();
})();
