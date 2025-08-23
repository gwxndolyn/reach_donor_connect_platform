"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-lg shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Upload Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleUpload}>
            {/* Student Selector */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Student
              </label>
              <select
                className="w-full border rounded-md p-2 text-sm"
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

            {/* File Upload */}
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2"
              >
                {file ? "Change File" : "Upload File"}
              </Button>
              <span className="text-sm text-gray-700">
                {file ? file.name : "No file selected"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={uploading || loadingStudents}
            >
              {uploading ? "Uploading..." : "Upload Notes"}
            </Button>

            {/* Status Message */}
            {message && (
              <p
                className={`text-center mt-4 text-sm font-medium ${
                  message.startsWith("✅")
                    ? "text-green-600"
                    : message.startsWith("❌")
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
