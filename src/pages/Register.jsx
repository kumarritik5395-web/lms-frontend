import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, User, Mail, Lock, Shield, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

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
    <div className="auth-bg-wrapper flex items-center justify-center p-4 sm:p-6">
      {/* Background ambient glowing shapes & grid overlay */}
      <div className="auth-grid-overlay" />
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <Card className="w-full max-w-md auth-card z-10 my-4">
        <div className="auth-card-top-bar" />

        <CardHeader className="space-y-3 pt-7 pb-3 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl brand-logo-icon flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <UserPlus className="w-7 h-7" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm mt-1">
              Join LMS Portal to manage & browse books
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-3.5 px-6 pt-2 pb-4">
            {errorMsg && (
              <div className="p-3 text-sm rounded-xl bg-red-50 border border-red-200 text-red-600 font-medium flex items-center gap-2 animate-in fade-in-50 duration-200">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Full Name
              </Label>
              <div className="relative auth-input-icon-wrapper">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10 h-10 auth-input border-slate-200 bg-white/70 rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </Label>
              <div className="relative auth-input-icon-wrapper">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-10 auth-input border-slate-200 bg-white/70 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password
              </Label>
              <div className="relative auth-input-icon-wrapper">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-10 auth-input border-slate-200 bg-white/70 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-md"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Account Role
              </Label>
              <div className="relative auth-input-icon-wrapper">
                <Shield className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors pointer-events-none z-10" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white/70 pl-10 pr-3 text-sm shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 pb-7 pt-2">
            <Button
              type="submit"
              className="w-full h-11 btn-primary-gradient gap-2 text-sm font-semibold rounded-xl"
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

            <div className="text-center text-xs text-slate-500 pt-1">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline-offset-4 hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Register;