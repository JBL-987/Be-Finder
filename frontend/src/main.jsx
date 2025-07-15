import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "declarations/backend";
import { canisterId } from "declarations/backend/index.js";
import Navbar_Component from "./components/Navbar";
import Footer_Component from "./components/Footer";
import App from "./pages/App";
import About from "./pages/About";
import Documentation from "./pages/Document";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import "../index.css";

const network = process.env.DFX_NETWORK;
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app"
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943";

function Main() {
  const [actor, setActor] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        const isLoggedIn = await client.isAuthenticated();
        
        if (isLoggedIn) {
          const identity = client.getIdentity();
          const newActor = createActor(canisterId, {
            agentOptions: {
              identity,
              ...(process.env.NODE_ENV !== "production" && {
                fetchRootKey: true,
                verifyQuerySignatures: false,
              }),
            },
          });
          setActor(newActor);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication initialization failed:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const newActor = createActor(canisterId, {
            agentOptions: {
              identity,
              ...(process.env.NODE_ENV !== "production" && {
                fetchRootKey: true,
                verifyQuerySignatures: false,
              }),
            },
          });

          setActor(newActor);
          setIsAuthenticated(true);
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setActor(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (isInitializing) {
      return (
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Navbar_Component
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/app" /> : <Home login={login} />
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <App
                actor={actor}
                isAuthenticated={isAuthenticated}
                login={login}
                logout={logout}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/Features" element={<Features />} />
        <Route path="/Pricing" element={<Pricing />} />
        <Route path="/Documentation" element={<Documentation />} />
        <Route path="/About" element={<About/>} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer_Component  isAuthenticated={isAuthenticated} />
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);