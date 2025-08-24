"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, FileText, Users, CheckCircle, AlertCircle, ArrowUp } from "lucide-react";
import { uploadNotes, getStudents } from "./actions";

export default function UploadNotes() {
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch students on mount
  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await getStudents();
      if (error) {
        setMessage(`Error: ${error}`);
      } else {
        setStudents(data || []);
      }
      setLoadingStudents(false);
    }
    fetchStudents();
  }, []);

  // Handle upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!selectedStudent || !file) {
      setMessage("Please select a student and choose a file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("student_id", selectedStudent);
    formData.append("file", file);

    const result = await uploadNotes(formData);
    setUploading(false);

    if (result.ok) {
      setMessage("✅ Note uploaded successfully!");
      setFile(null);
      setSelectedStudent("");
    } else {
      setMessage(`❌ Unexpected error, please retry upload`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload Student Notes
            </h1>
            <p className="text-gray-600">
              Share progress reports and updates with donors
            </p>
          </div>

          {/* Upload Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {message && (
              <div className={`mb-6 border rounded-lg p-4 flex items-center gap-3 ${
                message.includes("✅") 
                  ? "bg-green-50 border-green-200" 
                  : message.includes("❌")
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}>
                {message.includes("✅") ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : message.includes("❌") ? (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                )}
                <p className={`text-sm font-medium ${
                  message.includes("✅") 
                    ? "text-green-700" 
                    : message.includes("❌")
                    ? "text-red-700"
                    : "text-blue-700"
                }`}>
                  {message.replace(/[✅❌]/g, '').trim()}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleUpload}>
              {/* Student Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Student
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-colors text-gray-900"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    disabled={loadingStudents}
                  >
                    <option value="">
                      {loadingStudents ? "Loading students..." : "Choose a student"}
                    </option>
                    {students.map((student) => (
                      <option key={student.student_id} value={student.student_id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload File
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      {file ? (
                        <span className="text-red-600 font-medium">{file.name}</span>
                      ) : (
                        "Click to select a file or drag and drop"
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG, PDF up to 10MB
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || loadingStudents || !selectedStudent || !file}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-pink-700 focus:ring-4 focus:ring-red-200 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload Notes
                    <ArrowUp className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Upload progress reports, photos, or documents to keep donors informed about their sponsored students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
