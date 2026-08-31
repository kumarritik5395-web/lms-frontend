import React, { useState } from "react";
import { X, Download, FileText, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookReaderModal({ book, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!book) return null;

  const getPdfUrl = (b) => {
    if (!b) return "";
    let rawUrl = b.pdfUrl || b.pdf_url || b.pdf || b.fileUrl || b.file_url || b.url || b.link || b.pdfLink || b.bookPdf || "";
    if (typeof rawUrl === "object" && rawUrl !== null) {
      rawUrl = rawUrl.url || rawUrl.link || rawUrl.secure_url || "";
    }
    return typeof rawUrl === "string" ? rawUrl.trim() : "";
  };

  const pdfUrl = getPdfUrl(book);

  // Smart URL handler for local file:// URLs, web http:// URLs, and google drive
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("file://") || url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("/")) {
      return url;
    }
    if (url.includes("drive.google.com")) {
      return url.replace(/\/view.*$/, "/preview");
    }
    if (url.endsWith(".pdf") || url.includes(".pdf?")) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(pdfUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-800 ${
          isFullscreen ? "w-full h-full rounded-none" : "w-full max-w-5xl h-[88vh]"
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-amber-950/5 dark:bg-slate-900">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-amber-700 text-white shrink-0 shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {book.name || book.title || "Original Book Pages"}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                Author: {book.author || "Unknown"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pdfUrl && (
              <>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs bg-slate-50">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open Link</span>
                  </Button>
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="hidden sm:inline-flex"
                >
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </Button>
                </a>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
              onClick={onClose}
              title="Close Reader"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
          {pdfUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full border-none"
              title={book.name || "Book Reader"}
              allow="autoplay; encrypted-media; fullscreen"
            />
          ) : (
            <div className="text-center p-8 max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm">
              <FileText className="h-12 w-12 mx-auto text-amber-600 mb-3 opacity-80" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                No PDF / Original Pages Uploaded
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Is book ke liye PDF link attach nahi mila. Admin Panel se new book add karke try karein.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
