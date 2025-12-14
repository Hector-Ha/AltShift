import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./apollo/client";
import { socket } from "./socket/socket";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DocumentEditor from "./pages/DocumentEditor";

const App: React.FC = () => {
  useEffect(() => {
    // Optional: Global socket connection logic or cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doc/:id" element={<DocumentEditor />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
