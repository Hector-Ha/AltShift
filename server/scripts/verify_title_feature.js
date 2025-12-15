const API_URL = "http://localhost:4000/graphql";

// Regex from implementation to verify
const stripTitle = (t) =>
  t
    .replace(/^[\s#*_\->]+/, "")
    .replace(/[*_\[\]]/g, "")
    .trim();

async function runVerification() {
  console.log("--- 1. Verify Title Stripping Regex ---");
  const testCases = [
    { input: "# My Title", expected: "My Title" },
    { input: "**Bold Title**", expected: "Bold Title" },
    { input: "*Italic Title*", expected: "Italic Title" },
    { input: "## Subtitle", expected: "Subtitle" },
    { input: "Plain Title", expected: "Plain Title" },
    { input: "   #   Title with spaces", expected: "Title with spaces" },
    { input: "> Blockquote Title", expected: "Blockquote Title" },
    { input: "[Link](url)", expected: "Link(url)" },
  ];

  testCases.forEach(({ input, expected }) => {
    const result = stripTitle(input);
    if (result === expected) {
      console.log(`PASS: "${input}" -> "${result}"`);
    } else {
      console.error(
        `FAIL: "${input}" -> "${result}" (Expected: "${expected}")`
      );
    }
  });

  console.log("\n--- 2. Verify Backend Logic via API ---");

  const gqlRequest = async (query, variables, token) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error(
          "GraphQL Errors:",
          JSON.stringify(result.errors, null, 2)
        );
        throw new Error("GraphQL Error");
      }
      return result.data;
    } catch (error) {
      console.error("API Request Failed:", error.message);
      throw error;
    }
  };

  try {
    // Signup A
    const emailA = `userA_${Date.now()}@test.com`;
    const authA = await gqlRequest(
      `
      mutation Register($input: createUserInput!) {
        createUser(input: $input) { token user { id email } }
      }
    `,
      {
        input: {
          email: emailA,
          password: "password123",
          personalInformation: { firstName: "UserA" },
        },
      }
    );
    const tokenA = authA.createUser.token;
    const idA = authA.createUser.user.id;
    console.log(`Created User A: ${emailA}`);

    // Signup B
    const emailB = `userB_${Date.now()}@test.com`;
    const authB = await gqlRequest(
      `
      mutation Register($input: createUserInput!) {
        createUser(input: $input) { token user { id email } }
      }
    `,
      {
        input: {
          email: emailB,
          password: "password123",
          personalInformation: { firstName: "UserB" },
        },
      }
    );
    const tokenB = authB.createUser.token;
    const idB = authB.createUser.user.id;
    console.log(`Created User B: ${emailB}`);

    // Create Doc (User A)
    const docData = await gqlRequest(
      `
      mutation CreateDoc($input: createDocumentInput!) {
        createDocument(input: $input) { id title }
      }
    `,
      { input: { title: "Title A" } },
      tokenA
    );
    const docId = docData.createDocument.id;
    console.log(`Created Document: ${docId}`);

    // Invite B (User A)
    await gqlRequest(
      `
      mutation AddCollab($docId: ID!, $userId: ID!) {
        addCollaborator(documentID: $docId, userID: $userId) { id collaborators { id } }
      }
    `,
      { docId, userId: idB },
      tokenA
    );
    console.log("Invited B");

    // Accept Invitation (User B)
    // Note: addCollaborator creates an invitation. B needs to accept it.
    await gqlRequest(
      `
      mutation Accept($docId: ID!) {
        acceptCollaborateInvitation(documentID: $docId) { id collaborators { id } }
      }
    `,
      { docId },
      tokenB
    );
    console.log("User B Accepted Invitation");

    // Update Title (User B)
    const newTitle = "Title Updated by B";
    await gqlRequest(
      `
      mutation UpdateDoc($id: ID!, $input: updateDocumentInput!) {
        updateDocument(documentID: $id, input: $input) { id title }
      }
    `,
      { id: docId, input: { title: newTitle } },
      tokenB
    );
    console.log(`User B updated title to "${newTitle}"`);

    // Check Notifications (User A)
    const notifsA = await gqlRequest(
      `
      query GetNotifs {
        myNotifications {
          id
          message
          type
          document { title }
        }
      }
    `,
      {},
      tokenA
    );

    const foundNotif = notifsA.myNotifications.find((n) =>
      n.message.includes(`"${newTitle}"`)
    );
    if (foundNotif) {
      console.log(`PASS: Notification found! Message: "${foundNotif.message}"`);
    } else {
      console.error("FAIL: Notification NOT found.");
      console.log(
        "All Notifications:",
        JSON.stringify(notifsA.myNotifications, null, 2)
      );
    }
  } catch (e) {
    console.error("Test finished with errors.");
  }
}

runVerification();
