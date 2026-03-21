import React, { createContext, useContext, useState, useEffect } from "react";
const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [plan,  setPlan]  = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem("pw_u");
      const p = localStorage.getItem("pw_p");
      if (u) setUser(JSON.parse(u));
      if (p) setPlan(JSON.parse(p));
    } catch(_) {}
    setReady(true);
  }, []);

  const login = (userData, planData) => {
    setUser(userData);
    localStorage.setItem("pw_u", JSON.stringify(userData));
    if (planData) { setPlan(planData); localStorage.setItem("pw_p", JSON.stringify(planData)); }
  };

  const savePlan = (planData) => {
    setPlan(planData);
    localStorage.setItem("pw_p", JSON.stringify(planData));
    const u = { ...user, onboarded: true };
    setUser(u); localStorage.setItem("pw_u", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null); setPlan(null);
    localStorage.removeItem("pw_u"); localStorage.removeItem("pw_p");
  };

  return <Ctx.Provider value={{ user, plan, ready, login, savePlan, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
