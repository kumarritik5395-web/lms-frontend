import { useState, useEffect } from "react";
import API from "../api/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus, BookPlus, User, Hash, Layers, CheckCircle, FolderOpen, Trash2 } from "lucide-react";

function AdminDashboard() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState("");
  const [version, setVersion] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Helper function to sanitize and format Google Drive links
  const formatPdfLink = (url) => {
    if (!url) return "";
    let clean = url.trim();
    if (clean.includes("drive.google.com")) {
      // Replace /view?usp=sharing or /view or /edit with /preview
      clean = clean.replace(/\/view(\?.*)?$/, "/preview")
                   .replace(/\/edit(\?.*)?$/, "/preview")
                   .replace(/\/view\?.*$/, "/preview");
      if (!clean.endsWith("/preview")) {
        const fileIdMatch = clean.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          clean = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
        }
      }
    }
    return clean;
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const finalPdfUrl = formatPdfLink(pdfUrl);

      const { data } = await API.post(
        "/books",
        {
          name,
          title: name,
          bookName: name,
          author,
          authorName: author,
          author_name: author,
          writer: author,
          copies: Number(copies),
          version: Number(version),
          pdfUrl: finalPdfUrl,
          pdf: finalPdfUrl,
          fileUrl: finalPdfUrl,
        },
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
      setPdfUrl("");
    } catch (error) {
      console.error("Add book error details:", error);
      let msg = error.response?.data?.message || error.message || "Failed to add book";

      if (error.response?.status === 413) {
        msg = "Selected PDF file is too large to send directly. Kripya chhota PDF file select karein ya PDF ka Web/Google Drive URL link paste karein.";
      } else if (error.response?.status === 401 || msg.toLowerCase().includes("token") || msg.toLowerCase().includes("unauthorized")) {
        msg = "Session expired or invalid admin token. Please log in again.";
      } else if (error.response?.data && typeof error.response.data === "string") {
        msg = error.response.data;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        alert("Kripya sirf valid PDF file select karein!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPdfUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [booksList, setBooksList] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchBooksList = async () => {
    try {
      const { data } = await API.get("/books");
      setBooksList(data.books || []);
    } catch (err) {
      console.error("Error fetching books list:", err);
    }
  };

  useEffect(() => {
    fetchBooksList();
  }, []);

  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!window.confirm(`Kya aap "${bookTitle}" book ko library se delete karna chahte hain?`)) {
      return;
    }
    setDeleteLoading(bookId);
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Book deleted successfully!");
      await fetchBooksList();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete book");
    } finally {
      setDeleteLoading(null);
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
              Manage library inventory, add new books, upload PDFs, and delete existing books.
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

              <div className="space-y-1.5">
                <Label htmlFor="pdf-file-picker" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Original Book PDF / Document File (Select from Computer)
                </Label>
                <div className="space-y-2">
                  <Input
                    id="pdf-file-picker"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange}
                    className="bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900 rounded-xl h-12 pt-1.5 cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-800 file:text-white hover:file:bg-amber-900 shadow-sm"
                  />

                  <div className="flex items-center gap-2 my-1">
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">OR Enter PDF URL</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  </div>

                  <Input
                    id="pdf-url"
                    type="text"
                    placeholder="https://drive.google.com/file/d/... or direct PDF link"
                    className="h-10 bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-slate-500">Select a PDF from your device or paste a direct URL.</p>
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

        {/* MANAGE EXISTING BOOKS & DELETE SECTION */}
        <Card className="max-w-2xl mx-auto shadow-md border-amber-900/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-3 border-b border-amber-900/10">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-700" />
              <span>Manage Existing Books & Delete</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Library catalog me se galat ya purani books delete karein.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {booksList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No books in inventory.</p>
            ) : (
              booksList.map((b) => (
                <div key={b._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="truncate">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{b.name || b.title}</h4>
                    <p className="text-xs text-slate-500 truncate">Author: {b.author || "Unknown"} | Copies: {b.copies ?? 0}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg shrink-0 cursor-pointer"
                    disabled={deleteLoading === b._id}
                    onClick={() => handleDeleteBook(b._id, b.name || b.title)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{deleteLoading === b._id ? "Deleting..." : "Delete"}</span>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;