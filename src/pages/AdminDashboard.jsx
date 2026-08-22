import { useState } from "react";
import API from "../api/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus, BookPlus, User, Hash, Layers, CheckCircle } from "lucide-react";

function AdminDashboard() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState("");
  const [version, setVersion] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.post(
        "/books",
        { name, author, copies: Number(copies), version: Number(version) },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccessMsg(`Book added successfully: "${data.book?.name || name}"`);
      setName("");
      setAuthor("");
      setCopies("");
      setVersion("");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add book";
      if (error.response?.status === 401 || msg.toLowerCase().includes("token")) {
        setErrorMsg("Session expired or invalid token. Please log in again.");
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Page Background Wrapper with Khaki Theme */
    <div className="min-h-[calc(100vh-4rem)] bg-[#F0E68C]/35 dark:bg-amber-950/20 py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Admin Welcome Banner */}
        <div className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-emerald-900/10 dark:bg-emerald-950/40 border border-emerald-800/20 shadow-sm">
          <div className="p-3 rounded-xl bg-[#263B2A] text-white shadow-md shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F251F] dark:text-emerald-200">
              Admin Control Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              Manage library inventory, add new books with author details, copies count, and versions.
            </p>
          </div>
        </div>

        {/* Add New Book Form Card */}
        <Card className="max-w-2xl mx-auto shadow-md border-amber-900/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl">
          <CardHeader className="space-y-1.5 pb-4 border-b border-amber-900/10">
            <div className="flex items-center gap-2">
              <BookPlus className="h-5 w-5 text-amber-800 dark:text-amber-400" />
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Add New Book to Inventory
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Fill in the details below to publish a new book entry in the library catalog.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleAddBook}>
            <CardContent className="space-y-4 pt-6">
              {successMsg && (
                <div className="p-3.5 text-sm rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 text-sm rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="book-name" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Book Title / Name
                  </Label>
                  <div className="relative">
                    <BookPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="book-name"
                      type="text"
                      placeholder="Enter book title"
                      className="pl-10 h-11 bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="author-name" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Author Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="author-name"
                      type="text"
                      placeholder="Enter author name"
                      className="pl-10 h-11 bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="copies" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Number of Copies
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="copies"
                      type="number"
                      min="1"
                      placeholder="Enter number of copies"
                      className="pl-10 h-11 bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl"
                      value={copies}
                      onChange={(e) => setCopies(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="version" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Book Version / Edition
                  </Label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="version"
                      type="number"
                      min="1"
                      placeholder="Enter book version"
                      className="pl-10 h-11 bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6">
              <Button
                type="submit"
                className="w-full sm:w-auto ml-auto gap-2 h-11 px-6 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-semibold shadow-md transition-all cursor-pointer"
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
                <span>{loading ? "Adding Book..." : "Add Book to Library"}</span>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;