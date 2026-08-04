import { useState } from "react";
import API from "../api/axios";

function AdminDashboard(){
    const [name,setName] = useState("");
    const [copies,setCopies] = useState("");
    const [version,setVersion] = useState("");

    const handleAddBook = async(e) =>{
        e.preventDefault()
        try {
            const {data} = await API.post("/books",{name,copies,version});
            alert("Book added: "+ data.book.name) 
        } catch (error) {
            alert(error.response.data.message);   
        }
    }
    return(
        <div>
            <h2>Admin Dashboard</h2>
            <form onSubmit={handleAddBook}>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter book name"/>
                <input type="number" value={copies} onChange={e=>setCopies(e.target.value)} placeholder="Enter copies"/>
                <input type="number" value={version} onChange={e=>setVersion(e.target.value)} placeholder="Enter version"/>
                <button>Add book</button>
            </form>
        </div>
    )
}

export default AdminDashboard