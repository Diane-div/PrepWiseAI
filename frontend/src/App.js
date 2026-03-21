import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar        from "./components/layout/Navbar";
import LandingPage   from "./pages/LandingPage";
import AuthPage      from "./pages/AuthPage";
import OnboardPage   from "./pages/OnboardPage";
import DashboardPage from "./pages/DashboardPage";
import TopicPage     from "./pages/TopicPage";
import ChatPage      from "./pages/ChatPage";

function Loader() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Guard({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <Loader />;
  return user ? children : <Navigate to="/auth" replace />;
}

function AppInner() {
  const { user, plan } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"    element={<LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to={plan ? "/dashboard" : "/onboard"} /> : <AuthPage />} />
        <Route path="/onboard"   element={<Guard>{plan ? <Navigate to="/dashboard" /> : <OnboardPage />}</Guard>} />
        <Route path="/dashboard" element={<Guard>{!plan ? <Navigate to="/onboard" /> : <DashboardPage />}</Guard>} />
        <Route path="/topic/:subject/:slug" element={<Guard><TopicPage /></Guard>} />
        <Route path="/chat" element={<Guard><ChatPage /></Guard>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
        <Toaster position="top-right" toastOptions={{
          style: { background: "#0e1014", color: "#eef0f3", border: "1px solid rgba(255,255,255,0.08)", fontSize: "13px" }
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
