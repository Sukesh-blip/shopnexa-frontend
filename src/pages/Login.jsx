
import { api } from "../services/api";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    window.location = "/products";
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="username" onChange={e=>setUsername(e.target.value)} />
      <input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}
