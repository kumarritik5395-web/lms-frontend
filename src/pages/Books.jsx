import { useEffect, useState } from "react";
import API from "../api/axios";


export default function Books() {
  const [books, setBooks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const issueBook = async (bookId) =>{
    try {
        await API.post('/books/issue',{userId: user._id , bookId});
        alert("book issued successfully")  
    } catch (error) {
      alert(error.response.data.message);
    }
  }  

  const returnBook = async (bookId) =>{
    try {
      await API.post("/books/return",{userId: user._id,bookId});
      alert("Book returned successfully!");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  
  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await API.get("/books");
      setBooks(data.books);
    };
    fetchBooks();
  }, []);
 
return (
<div>
   <h2>Library Books</h2>
    <ul>
      {books.map((b) => (
       <li key={b._id}>
        {b.name} - {b.author} ({b.copies} copies)
        <button onClick={() => issueBook(b._id)}>Issue</button>
        <button onClick={() => returnBook(b._id)}>Return</button>
        
       </li>
      ))}
    </ul>
</div>
);
}

