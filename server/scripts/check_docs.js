const LOGIN_QUERY = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id }
    }
  }
`;

const GET_DOCS = `
  query GetDocuments {
    getDocuments(filter: {}) {
      id
      title
      owner { id email }
    }
  }
`;

async function checkDocs() {
  try {
    const loginRes = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LOGIN_QUERY,
        variables: { email: "user1@gmail.com", password: "user1" },
      }),
    });
    const loginData = await loginRes.json();
    const token = loginData.data.login.token;
    console.log("Logged in. User ID:", loginData.data.login.user.id);

    const docRes = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: GET_DOCS }),
    });
    const docData = await docRes.json();
    console.log("Documents found:", docData.data.getDocuments.length);
    docData.data.getDocuments.forEach((d) =>
      console.log(`- ${d.id}: ${d.title} (Owner: ${d.owner.email})`)
    );
  } catch (e) {
    console.error(e);
  }
}
checkDocs();
