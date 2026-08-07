import { useEffect, useState } from "react";
import API from "../api/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, BookmarkPlus, RotateCcw, User, Layers, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/books");
      setBooks(data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const issueBook = async (bookId) => {
    setActionLoading(`issue-${bookId}`);
    try {
      await API.post('/books/issue', { userId: user?._id, bookId });
      alert("Book issued successfully!");
      fetchBooks(); // refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to issue book");
    } finally {
      setActionLoading(null);
    }
  };

  const returnBook = async (bookId) => {
    setActionLoading(`return-${bookId}`);
    try {
      await API.post("/books/return", { userId: user?._id, bookId });
      alert("Book returned successfully!");
      fetchBooks(); // refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to return book");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBooks = books.filter((b) =>
    b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Library Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse, issue, and manage available books in the library
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books or authors..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchBooks} title="Refresh catalog">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
          <p>Loading library catalog...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No books found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery ? "Try searching with a different keyword." : "There are currently no books in the library."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((b) => {
            const isAvailable = b.copies > 0;
            return (
              <Card key={b._id} className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg font-bold text-slate-900 leading-snug">
                      {b.name}
                    </CardTitle>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {isAvailable ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {isAvailable ? `${b.copies} left` : "Out of stock"}
                    </span>
                  </div>
                  {b.author && (
                    <CardDescription className="flex items-center gap-1.5 text-slate-600 mt-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{b.author}</span>
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="py-2 text-xs text-slate-500 space-y-1">
                  {b.version && (
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      <span>Version: {b.version}</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-3 gap-2 border-t border-slate-100 mt-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 gap-1.5"
                    disabled={!isAvailable || actionLoading === `issue-${b._id}`}
                    onClick={() => issueBook(b._id)}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    <span>Issue</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    disabled={actionLoading === `return-${b._id}`}
                    onClick={() => returnBook(b._id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Return</span>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
