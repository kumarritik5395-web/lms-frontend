import { BrowserRouter , Routes,Route} from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Books from './pages/Books'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from "./components/Navbar"

function App() {
  
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/books" element={<ProtectedRoute>< Books /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute>< Profile /></ProtectedRoute>}/>
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard role="admin" /></ProtectedRoute>}/>
      </Routes>
    
    </BrowserRouter>
      
  )
}

export default App
