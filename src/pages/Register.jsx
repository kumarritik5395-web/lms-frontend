// import React from 'react'
import {useState} from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

 function Register(){
    const [name , setName ] = useState("");
    const [email , setEmail ] = useState("");
    const [password ,setPassword ] = useState("");
    const [role , setRole ] = useState("student");
    const navigate = useNavigate();

    const handleRegister = async(e) =>{
        e.preventDefault();
        try {
            const { data } = await API.post("/auth/register",{
                name, email, password , role
            });

            alert("Registration successful! please login");
            navigate("/login");

        } catch (error) {
            alert(error.response.data.message);      
        }
    } 
    return(
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input placeholder="Name" value={name} onChange={(e)=> setName(e.target.value)}/>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <select value={role} onChange={(e)=>setRole(e.target.value)}>
                <option value={"student"}>Student</option>
                <option value={"admin"}>Admin</option>
            </select>
            <button>Register</button>
        </form>
    )  
}

export default Register