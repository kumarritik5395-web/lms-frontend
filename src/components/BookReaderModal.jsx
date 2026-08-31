import React, { useState } from "react";
import { X, Download, FileText, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookReaderModal({ book, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!book) return null;

  const pdfUrl = book.pdfUrl || book.pdf || book.fileUrl || book.url;

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
                {book.name || "Original Book Pages"}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                Author: {book.author || "Unknown"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pdfUrl && (
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
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-none"
              title={book.name || "Book Reader"}
            />
          ) : (
            <div className="text-center p-8 max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm">
              <FileText className="h-12 w-12 mx-auto text-amber-600 mb-3 opacity-80" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                No PDF / Original Pages Uploaded
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Is book ke liye original pages ya PDF link attach nahi kiya gaya hai. Admin Panel se edit karke URL add kar sakte hain.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
