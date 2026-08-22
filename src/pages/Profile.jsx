import { useState, useEffect } from "react";
import API from '../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, Mail, Shield, BookOpen, Loader2, BookmarkCheck } from "lucide-react";

const getAuthorName = (book) => {
  if (!book) return "Unknown";
  let val = book.author || book.authorName || book.author_name || book.writer || book.by;
  if (val && typeof val === "object") {
    val = val.name || val.author || val.fullName || val.writer || "";
  }
  if (!val || typeof val !== "string") return "Unknown";
  const trimmed = val.trim();
  const lower = trimmed.toLowerCase();
  if (!trimmed || ["unknown", "unkrown", "n/a", "null", "undefined"].includes(lower)) {
    return "Unknown";
  }
  return trimmed;
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Loading Profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-6">
          <p className="text-destructive font-medium">Failed to load profile. Please log in again.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F0E68C]/35 dark:bg-amber-950/20 py-6 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Profile Info Header Card */}
        <Card className="shadow-md border-amber-900/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-amber-900/10">
            <div className="w-16 h-16 rounded-full bg-amber-800/10 flex items-center justify-center text-amber-900 dark:text-amber-300 font-bold text-2xl border border-amber-800/20">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </CardDescription>
            </div>
            <div className="sm:ml-auto">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                profile.role === 'admin' 
                  ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                <Shield className="h-3.5 w-3.5" />
                {profile.role}
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-amber-50/70 dark:bg-slate-800/60 border border-amber-900/10">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Full Name</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{profile.name}</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50/70 dark:bg-slate-800/60 border border-amber-900/10">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Email Address</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{profile.email}</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50/70 dark:bg-slate-800/60 border border-amber-900/10">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Role</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 capitalize">{profile.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issued Books Card */}
        <Card className="shadow-md border-amber-900/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-800 dark:text-amber-400" />
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Issued Books</CardTitle>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-medium border border-amber-200 dark:border-amber-800">
                {profile.issuedBooks?.length || 0} Books
              </span>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Books currently borrowed and assigned to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!profile.issuedBooks || profile.issuedBooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-amber-50/40 dark:bg-slate-800/30 rounded-lg border border-dashed border-amber-900/20">
                <BookmarkCheck className="h-10 w-10 mx-auto text-amber-800/40 dark:text-amber-400/40 mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-300">No books currently issued</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Explore the books section to borrow books.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.issuedBooks.map((b) => (
                  <div
                    key={b.bookId?._id || Math.random()}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-amber-700/30 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{b.bookId?.name || "Book Name"}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-400" />
                        <span>
                          By {getAuthorName(b.bookId)}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Version: {b.bookId?.version || "1.0"}</p>
                    </div>
                    <span className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                      Issued
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}