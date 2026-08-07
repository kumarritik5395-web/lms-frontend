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
      const { data } = await API.post("/books", { name, author, copies, version });
      setSuccessMsg(`Book added successfully: "${data.book?.name || name}"`);
      setName("");
      setAuthor("");
      setCopies("");
      setVersion("");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 space-y-6">
      {/* Admin Welcome Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
        <div className="p-3 rounded-lg bg-amber-500 text-white shadow-sm">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Manage library inventory, add new books with authors, and update copy versions.
          </p>
        </div>
      </div>

      {/* Add New Book Form Card */}
      <Card className="max-w-2xl mx-auto shadow-md border-slate-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <BookPlus className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">Add New Book to Inventory</CardTitle>
          </div>
          {<CardDescription>
            Fill in the details below to publish a new book entry in the library catalog.
          </CardDescription>}
        </CardHeader>

        <form onSubmit={handleAddBook}>
          <CardContent className="space-y-4">
            {successMsg && (
              <div className="p-3 text-sm rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="book-name">Book Title / Name</Label>
                <div className="relative">
                  <BookPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="book-name"
                    type="text"
                    placeholder="Enter name"
                    className="pl-9"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author-name">Author Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="author-name"
                    type="text"
                    placeholder="Enter author name"
                    className="pl-9"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="copies">Number of Copies</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="copies"
                    type="number"
                    min="1"
                    placeholder="Enter number of copies"
                    className="pl-9"
                    value={copies}
                    onChange={(e) => setCopies(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Book Version / Edition</Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="version"
                    type="number"
                    min="1"
                    placeholder="Enter book version"
                    className="pl-9"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button type="submit" className="w-full sm:w-auto ml-auto gap-2" disabled={loading}>
              <Plus className="h-4 w-4" />
              <span>{loading ? "Adding Book..." : "Add Book"}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AdminDashboard;