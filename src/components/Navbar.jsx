import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, User, ShieldCheck, LogIn, UserPlus, LogOut, Library } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full navbar-header">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">

                {/* Left Side: Brand Logo & Nav Links */}
                <div className="flex items-center gap-6">
                    {/* Brand Logo */}
                    <Link to="/books" className="brand-logo-container flex items-center gap-2.5 font-bold text-xl tracking-tight transition-all duration-200">
                        <div className="brand-logo-icon p-2 rounded-xl text-white">
                            <Library className="h-5 w-5" />
                        </div>
                        <span className="brand-title">LMS Portal</span>
                    </Link>

                    {/* Left Aligned Navigation Links */}
                    <nav className="flex items-center gap-1.5">
                        <Link to="/books">
                            <Button
                                variant="ghost"
                                className={`nav-link-btn gap-2 font-medium ${isActive("/books") ? "is-active" : ""}`}
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Books</span>
                            </Button>
                        </Link>

                        <Link to="/profile">
                            <Button
                                variant="ghost"
                                className={`nav-link-btn gap-2 font-medium ${isActive("/profile") ? "is-active" : ""}`}
                            >
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                            </Button>
                        </Link>

                        {user?.role === "admin" && (
                            <Link to="/admin">
                                <Button
                                    variant="ghost"
                                    className={`nav-link-btn admin-nav-btn gap-2 font-medium ${isActive("/admin") ? "is-active" : ""}`}
                                >
                                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                                    <span>Admin Dashboard</span>
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Right Side: Auth Buttons / User Profile Actions */}
                <div className="flex items-center gap-3">
                    {!user ? (
                        <div className="flex items-center gap-2.5">
                            <Link to="/login">
                                <Button variant="ghost" className="nav-link-btn gap-2 font-medium">
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="btn-primary-gradient gap-2 font-medium rounded-lg">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Register</span>
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full user-badge">
                                <User className="h-3.5 w-3.5 text-indigo-600" />
                                <span className="text-xs font-semibold text-slate-700">
                                    Welcome, <span className="text-indigo-600 font-bold">{user.name || user.email?.split('@')[0] || "User"}</span>
                                </span>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleLogout}
                                className="btn-logout gap-2 font-medium rounded-lg"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}
