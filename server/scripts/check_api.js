import http from "http";

const postData = JSON.stringify({ query: "{ __typename }" });

console.log("Checking GraphQL API at http://localhost:4000/graphql ...");

const options = {
  hostname: "localhost",
  port: 4000,
  path: "/graphql",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = "";
  res.setEncoding("utf8");
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      console.log("BODY:", JSON.stringify(parsed, null, 2));
    } catch {
      console.log("BODY:", data);
    }

    if (res.statusCode === 200) {
      console.log(
        "✅ API Check Passed: Server is responding to GraphQL queries."
      );
    } else {
      console.log("❌ API Check Failed: Server returned non-200 status.");
    }
  });
});

req.on("error", (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
  console.error(
    "Make sure the server is running (npm start) and listening on port 4000."
  );
});

req.write(postData);
req.end();
