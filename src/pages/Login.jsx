import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, BookOpen } from "lucide-react";

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
    <div className="auth-bg-wrapper flex items-center justify-center p-4 sm:p-6">
      {/* Background ambient glowing shapes & grid overlay */}
      <div className="auth-grid-overlay" />
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      {/* Main Glass Card */}
      <Card className="w-full max-w-md auth-card z-10">
        <div className="auth-card-top-bar" />

        <CardHeader className="space-y-3 pt-8 pb-4 text-center">
          {/* Header Brand Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl brand-logo-icon flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-7 h-7" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm mt-1">
              Enter your credentials to access LMS Portal
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 px-6 pt-2 pb-4">
            {errorMsg && (
              <div className="p-3 text-sm rounded-xl bg-red-50 border border-red-200 text-red-600 font-medium flex items-center gap-2 animate-in fade-in-50 duration-200">
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
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
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </Label>
              </div>
              <div className="relative auth-input-icon-wrapper">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-10 auth-input border-slate-200 bg-white/70 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          </CardContent>

          <CardFooter className="flex flex-col gap-4 px-6 pb-8 pt-2">
            <Button
              type="submit"
              className="w-full h-11 btn-primary-gradient gap-2 text-sm font-semibold rounded-xl"
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

            <div className="text-center text-xs text-slate-500 pt-1">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline-offset-4 hover:underline transition-colors"
              >
                Create an account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;