import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, User, Mail, Lock, Shield, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import libraryBgImg from "../assets/library_bg.jpg";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await API.post("/auth/register", { name, email, password, role });
      alert("Registration successful! Please login");
      navigate("/login");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${libraryBgImg})` }}
    >
      {/* Dark semi-transparent overlay */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[3px] pointer-events-none" />

      {/* Register Card */}
      <Card className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl shadow-2xl shadow-black/30 overflow-hidden z-10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 my-4">
        {/* Top Accent Gradient Bar (Violet -> Indigo -> Cyan) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#06B6D4]" />

        <CardHeader className="space-y-2 pt-6 pb-2 px-6 sm:px-8 text-center">
          {/* Library/Book Icon in gradient container */}
          <div className="mx-auto w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-purple-500/20 ring-2 ring-purple-50 dark:ring-purple-950/40">
            <UserPlus className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-xs font-medium text-[#64748B] dark:text-slate-400">
              Join LMS Portal and manage your library resources
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4 px-6 sm:px-8 pt-2 pb-6">
            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-300 font-medium flex items-start gap-2.5 animate-in fade-in-50 duration-200">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-300">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] group-focus-within:text-[#7C3AED] transition-colors" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="pl-10 h-11 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl text-[#0F172A] dark:text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#7C3AED]/25 focus-visible:border-[#7C3AED] transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
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
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
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
                  autoComplete="new-password"
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

            {/* Role Select */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-300">
                Account Role
              </Label>
              <div className="relative group">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] group-focus-within:text-[#7C3AED] transition-colors pointer-events-none z-10" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 pl-10 pr-4 text-sm text-[#0F172A] dark:text-white shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 focus:border-[#7C3AED]"
                >
                  <option value="student" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Student</option>
                  <option value="admin" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Admin</option>
                </select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 sm:px-8 pb-8 pt-2">
            {/* Register Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm text-[#64748B] dark:text-slate-400 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#7C3AED] dark:text-purple-400 font-semibold hover:text-[#4F46E5] hover:underline underline-offset-4 transition-colors"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Register;