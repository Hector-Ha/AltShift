import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./apollo/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    <Analytics />
  </StrictMode>
);
