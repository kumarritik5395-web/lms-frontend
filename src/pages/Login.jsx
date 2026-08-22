import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, BookOpen } from "lucide-react";
import loginBooksImg from "../assets/login_books.png";
import libraryBgImg from "../assets/library_bg.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/books");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${libraryBgImg})` }}
    >
      {/* Dark semi-transparent overlay to ensure text contrast and focus on card */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px] pointer-events-none" />

      {/* Main Glass Card Container */}
      <div className="relative w-full max-w-4xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl shadow-black/30 overflow-hidden z-10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 grid grid-cols-1 lg:grid-cols-12 my-4">
        {/* Top Accent Gradient Bar (Violet -> Indigo -> Cyan) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#06B6D4] col-span-full" />

        {/* Left Column: Login Form */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="space-y-3 mb-6 text-center lg:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center text-white shadow-lg shadow-purple-500/25 ring-4 ring-purple-50 dark:ring-purple-950/40 mx-auto lg:mx-0">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#0F172A] via-[#7C3AED] to-[#4F46E5] dark:from-white dark:via-purple-300 dark:to-indigo-200 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-sm font-medium text-[#64748B] dark:text-slate-400">
                Sign in to your LMS Portal account
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-300 font-medium flex items-start gap-2.5 animate-in fade-in-50 duration-200">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-300">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] group-focus-within:text-[#7C3AED] transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl text-[#0F172A] dark:text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#7C3AED]/25 focus-visible:border-[#7C3AED] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-300">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] group-focus-within:text-[#7C3AED] transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl text-[#0F172A] dark:text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#7C3AED]/25 focus-visible:border-[#7C3AED] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#7C3AED] transition-colors p-1 rounded-lg"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 gap-2 cursor-pointer mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Register Link */}
            <div className="text-center text-sm text-[#64748B] dark:text-slate-400 font-medium pt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#7C3AED] dark:text-purple-400 font-semibold hover:text-[#4F46E5] hover:underline underline-offset-4 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>

        {/* Right Column: Books Image Section */}
        <div className="lg:col-span-6 bg-gradient-to-br from-amber-950/20 via-amber-900/10 to-slate-900/40 p-6 lg:p-8 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-200/60 dark:border-slate-800 relative overflow-hidden">
          <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-amber-950/20 border border-amber-900/20 max-w-sm">
              <img
                src={loginBooksImg}
                alt="Stacked books"
                className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 text-white text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">Library Management</span>
                <p className="text-sm font-bold">Access Thousands of Digital Books & Resources</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;