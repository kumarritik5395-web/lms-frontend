import { Link,useNavigate } from "react-router-dom";

export default function Navbar(){
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav style={{display:"flex", gap:"1rem", padding:"1rem",background:"#eee"}}>
        <Link to="/books"> Books </Link>
        <Link to="/profile">Profile</Link>
        {user?.role === 'admin' && <Link to="/admin"> Admin Dashboard </Link>}
        {!user ?(
            <>
            <Link to="/login"> Login </Link>
            <Link to="/register"> Register </Link>  
            </>
        ):(
            <button onClick={handleLogout}> Logout </button>
        )}
        </nav>
        
    );
}


