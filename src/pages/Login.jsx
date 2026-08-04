import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
 
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/books");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };
 
  return (
   <form onSubmit={handleLogin}>
    <h2>Login</h2>
    <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />
    <button type="submit">Login</button>
  </form>
  );
}
export default Login;