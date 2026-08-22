import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import API from "../api/axios";
import { setBooks } from "@/redux/slice";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  BookOpen,
  Search,
  BookmarkPlus,
  RotateCcw,
  User,
  Layers,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

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

export default function Books() {
  // Redux
  const dispatch = useDispatch();

  // Books Redux Store se milenge
  const books = useSelector((state) => state.Books);


  // Local States
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // FETCH BOOKS
  // =========================
  const fetchBooks = async () => {
    setLoading(true);

    try {
      const { data } = await API.get("/books");

      // API se books Redux me save
      dispatch(setBooks(data.books || []));
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Component load hone par books fetch
  useEffect(() => {
    fetchBooks();
  }, []);

  // =========================
  // ISSUE BOOK
  // =========================
  const issueBook = async (bookId) => {
    setActionLoading(`issue-${bookId}`);

    try {
      await API.post("/books/issue", {
        userId: user?._id,
        bookId: bookId,
      });

      alert("Book issued successfully!");

      // Redux data refresh
      await fetchBooks();
    } catch (error) {
      console.error("Issue book error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to issue book"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // RETURN BOOK
  // =========================
  const returnBook = async (bookId) => {
    setActionLoading(`return-${bookId}`);

    try {
      await API.post("/books/return", {
        userId: user?._id,
        bookId: bookId,
      });

      alert("Book returned successfully!");

      // Redux data refresh
      await fetchBooks();
    } catch (error) {
      console.error("Return book error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to return book"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =========================
  // SEARCH BOOKS
  // =========================
  const filteredBooks = books.filter((book) => {
    const name = book.name?.toLowerCase() || "";
    const author = getAuthorName(book).toLowerCase();
    const search = searchQuery.toLowerCase();

    return (
      name.includes(search) ||
      author.includes(search)
    );
  });

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F0E68C]/35 dark:bg-amber-950/20 py-6 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">

        {/* Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold">
              Library Catalog
            </h1>

            <p className="text-muted-foreground mt-1">
              Browse, issue, and manage available books in the library
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">

            {/* Search */}
            <div className="relative w-full sm:w-72">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search books or authors..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />

            </div>

            {/* Refresh */}
            <Button
              variant="outline"
              size="icon"
              onClick={fetchBooks}
              title="Refresh catalog"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""
                  }`}
              />
            </Button>

          </div>
        </div>

        {/* ========================= */}
        {/* LOADING */}
        {/* ========================= */}

        {loading ? (

          <div className="text-center py-12 text-muted-foreground">

            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />

            <p>
              Loading library catalog...
            </p>

          </div>

        ) : filteredBooks.length === 0 ? (

          /* ========================= */
          /* NO BOOKS */
          /* ========================= */

          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">

            <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-3" />

            <h3 className="text-lg font-semibold text-slate-700">
              No books found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {searchQuery
                ? "Try searching with a different keyword."
                : "There are currently no books in the library."}
            </p>

          </div>

        ) : (

          /* ========================= */
          /* BOOK GRID */
          /* ========================= */

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredBooks.map((book) => {

              const isAvailable =
                book.copies > 0;

              return (

                <Card
                  key={book._id}
                  className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow border-slate-200"
                >

                  {/* Card Header */}
                  <CardHeader className="pb-3">

                    <div className="flex items-start justify-between gap-2">

                      <CardTitle className="text-lg font-bold text-slate-900 leading-snug">
                        {book.name}
                      </CardTitle>

                      {/* Availability */}
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${isAvailable
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                      >

                        {isAvailable ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}

                        {isAvailable
                          ? `${book.copies} left`
                          : "Out of stock"}

                      </span>

                    </div>

                    {/* Author */}
                    <CardDescription className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold text-xs mt-1.5 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-md w-fit border border-slate-200/60 dark:border-slate-700">
                      <User className="h-3.5 w-3.5 text-amber-800 dark:text-amber-400" />
                      <span>
                        Author: {getAuthorName(book)}
                      </span>
                    </CardDescription>

                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="py-2 text-xs text-slate-500 space-y-1">

                    {book.version && (

                      <div className="flex items-center gap-1.5">

                        <Layers className="h-3.5 w-3.5 text-slate-400" />

                        <span>
                          Version: {book.version}
                        </span>

                      </div>

                    )}

                  </CardContent>

                  {/* Card Footer */}
                  <CardFooter className="pt-3 gap-2 border-t border-slate-100 mt-2">

                    {/* ISSUE BUTTON */}
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 gap-1.5"
                      disabled={
                        !isAvailable ||
                        actionLoading ===
                        `issue-${book._id}`
                      }
                      onClick={() =>
                        issueBook(book._id)
                      }
                    >

                      <BookmarkPlus className="h-4 w-4" />

                      <span>
                        {actionLoading ===
                          `issue-${book._id}`
                          ? "Issuing..."
                          : "Issue"}
                      </span>

                    </Button>

                    {/* RETURN BUTTON */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      disabled={
                        actionLoading ===
                        `return-${book._id}`
                      }
                      onClick={() =>
                        returnBook(book._id)
                      }
                    >

                      <RotateCcw className="h-4 w-4" />

                      <span>
                        {actionLoading ===
                          `return-${book._id}`
                          ? "Returning..."
                          : "Return"}
                      </span>

                    </Button>

                  </CardFooter>

                </Card>

              );
            })}

          </div>

        )}

      </div>
    </div>
  );
}
