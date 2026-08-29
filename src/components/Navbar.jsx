import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, User, ShieldCheck, LogIn, UserPlus, LogOut, Library, Menu, X } from "lucide-react";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setMobileMenuOpen(false);
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full navbar-header">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">

                {/* Left Side: Brand Logo & Desktop Nav Links */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Brand Logo */}
                    <Link to="/books" onClick={() => setMobileMenuOpen(false)} className="brand-logo-container flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight transition-all duration-200">
                        <div className="brand-logo-icon p-1.5 sm:p-2 rounded-xl text-white">
                            <Library className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span className="brand-title">LMS Portal</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1.5">
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

                {/* Right Side: Desktop Actions & Mobile Menu Toggle */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Desktop Auth/User Section */}
                    <div className="hidden md:flex items-center gap-3">
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
                                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full user-badge">
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

                    {/* Mobile Hamburger Menu Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Collapsible Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-4 pt-3 pb-4 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                    {user && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 mb-2">
                            <User className="h-4 w-4 text-indigo-600 shrink-0" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                                {user.name || user.email || "User"}
                            </span>
                            {user.role === 'admin' && (
                                <span className="ml-auto text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                                    Admin
                                </span>
                            )}
                        </div>
                    )}

                    <Link to="/books" onClick={() => setMobileMenuOpen(false)} className="block">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2.5 font-medium ${isActive("/books") ? "is-active bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400" : ""}`}
                        >
                            <BookOpen className="h-4 w-4" />
                            <span>Books Catalog</span>
                        </Button>
                    </Link>

                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start gap-2.5 font-medium ${isActive("/profile") ? "is-active bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400" : ""}`}
                        >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                        </Button>
                    </Link>

                    {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block">
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-2.5 font-medium ${isActive("/admin") ? "is-active" : ""}`}
                            >
                                <ShieldCheck className="h-4 w-4 text-amber-600" />
                                <span>Admin Dashboard</span>
                            </Button>
                        </Link>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                        {!user ? (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                                    <Button variant="outline" className="w-full justify-center gap-2">
                                        <LogIn className="h-4 w-4" />
                                        <span>Login</span>
                                    </Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                                    <Button className="w-full btn-primary-gradient justify-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        <span>Register</span>
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                className="w-full justify-center gap-2 btn-logout"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
