const BASE = "/api";

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(e.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  register:       (d) => req("/auth/register",  { method: "POST", body: JSON.stringify(d) }),
  login:          (d) => req("/auth/login",     { method: "POST", body: JSON.stringify(d) }),
  generatePlan:   (d) => req("/plan/generate",  { method: "POST", body: JSON.stringify(d) }),
  getPlan:        (id) => req(`/plan/${id}`),
  sendMessage:    (d) => req("/chat/message",   { method: "POST", body: JSON.stringify(d) }),
  getTopicContent:(d) => req("/topic/content",  { method: "POST", body: JSON.stringify(d) }),
};
