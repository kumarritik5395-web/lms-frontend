import { useState, useEffect} from "react";
import API from '../api/axios';


export default function Profile(){
    const [profile, setProfile ] = useState(null);

    useEffect(() =>{
        const fetchProfile = async () =>{
            try{
            const {data} = await API.get("/auth/profile");
            setProfile(data.user);
        } catch(error){
            console.error("Error fetching profile:", error);
        }
    };
        fetchProfile();  
    }, []);
    if(!profile) return <p> Loading...</p>;

return (
    <div>
        <h2> Profile</h2>
        <p> Name: {profile.name}</p>
        <p> Email: {profile.email}</p>
        <p> Role: {profile.role}</p>
        <h3> Issued Books: </h3>
        <ul>
            {profile.issuedBooks.map((b)=>(
                <li key={b.bookId._id}>{b.bookId.name} (Version: {b.bookId.version}) </li>
            ))}
        </ul>
    </div>
  )
}