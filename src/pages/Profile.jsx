import { useState, useEffect } from "react";
import API from '../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User, Mail, Shield, BookOpen, Loader2, BookmarkCheck } from "lucide-react";

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
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 space-y-6">
      {/* Profile Info Header Card */}
      <Card className="shadow-md border-slate-200">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border border-primary/20">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
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
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-muted-foreground font-medium uppercase">Full Name</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{profile.name}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-muted-foreground font-medium uppercase">Email Address</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">{profile.email}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-muted-foreground font-medium uppercase">Role</p>
              <p className="text-sm font-semibold text-slate-800 mt-1 capitalize">{profile.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issued Books Card */}
      <Card className="shadow-md border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">Issued Books</CardTitle>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {profile.issuedBooks?.length || 0} Books
            </span>
          </div>
          <CardDescription>
            Books currently borrowed and assigned to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!profile.issuedBooks || profile.issuedBooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
              <BookmarkCheck className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-600">No books currently issued</p>
              <p className="text-xs text-slate-400">Explore the books section to borrow books.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.issuedBooks.map((b) => (
                <div
                  key={b.bookId?._id || Math.random()}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm text-slate-900">{b.bookId?.name || "Book Name"}</p>
                    <p className="text-xs text-muted-foreground">Version: {b.bookId?.version || "1.0"}</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-1 rounded-md border border-emerald-200">
                    Issued
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}