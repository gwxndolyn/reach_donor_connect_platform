"use client";

import { useState } from "react";
import { uploadNotes } from "./actions";

export default function UploadNotesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Add files (cumulative, max 10)
  const handleFiles = (selectedFiles: FileList | File[]) => {
    const newFiles = Array.from(selectedFiles);
    const combinedFiles = [...files, ...newFiles].slice(0, 10); // limit 10
    setFiles(combinedFiles);
    setMessage(null); // clear previous messages
  };

  // Remove a file by index
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle upload submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("Please select at least one image.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const result = await uploadNotes(formData);
    setLoading(false);

    if (result.ok) {
      setMessage("✅ Upload successful!");
      setFiles([]);
    } else {
      setMessage(`❌ Upload failed: ${result.error}`);
    }
  };

  // Drag-and-drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    handleFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload Notes
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col p-4 cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <div className="flex flex-col justify-center items-center flex-1">
              <p className="text-gray-500 mb-1">Click or drag images here</p>
              <p className="text-gray-400 text-sm mb-4">Up to 10 images</p>
            </div>

            {/* File list inside drop zone */}
            {files.length > 0 && (
              <div className="overflow-y-auto flex-grow w-full">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-xl mb-1"
                  >
                    {/* Image preview */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                    {/* File name */}
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent drop zone click
                        removeFile(idx);
                      }}
                      className="text-red-600 font-bold hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          {/* Upload button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Notes"}
          </button>

          {/* Status message */}
          {message && (
            <p
              className={`text-center text-sm mt-2 ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
