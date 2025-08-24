"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uploadNotes, getStudents } from "./actions";

const journalTopics = [
  // Everyday Life & Routines
  "My Morning – What do you do when you wake up?",
  "At the Playground – What games do you play with your friends?",
  "My Favorite Food – Describe what you like to eat and why.",
  "Bath Time – How do you take a bath? Do you play with toys?",
  "Bedtime – What do you do before going to sleep?",

  // Animals & Nature
  "My Pet (or Favorite Animal) – What does it look like? What does it eat?",
  "At the Zoo – Which animal do you like the most?",
  "A Bug I Saw – Describe a butterfly, ant, or ladybug you found.",
  "The Weather Today – Is it sunny, rainy, or windy? What do you wear?",
  "A Tree or Flower – What color is it? How does it smell?",

  // Fun & Feelings
  "My Birthday Party – Who came? What cake did you eat?",
  "A Happy Day – What made you smile today?",
  "A Sad Day – What made you feel upset, and who helped you?",
  "What I Want to Be – Imagine your dream job (teacher, pilot, doctor, superhero).",
  "If I Could Fly – Where would you go?",

  // Imagination & Creativity
  "My Favorite Toy – What is it? Why do you love it?",
  "A Trip on a Rocket – Where do you go in space?",
  "If I Were a Superhero – What powers would you have?",
  "My Magic Animal Friend – What adventures would you go on?",
  "A Castle in the Sky – Who lives there? What do you see?",

  // School & Friends
  "My Classroom – What do you see in class?",
  "My Best Friend – What games do you play together?",
  "A Song I Like – What song do you sing at school?",
  "What I Learned Today – One new thing you discovered.",
  "Sharing is Caring – Write about a time you shared something.",
];

export default function UploadNotes() {
  const [students, setStudents] = useState<
    { student_id: string; name: string }[]
  >([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedJournalTopic, setSelectedJournalTopic] = useState("");
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

    if (!selectedStudent || !selectedJournalTopic || !file) {
      setMessage("Please select a student, journal topic, and upload a file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("student_id", selectedStudent);
    formData.append("file", file);
    formData.append("journal_topic", selectedJournalTopic); // Using file name as journal topic for simplicity

    const result = await uploadNotes(formData);
    setUploading(false);

    if (result.ok) {
      setMessage("✅ Note uploaded successfully!");
      setFile(null);
      setSelectedStudent("");
      setSelectedJournalTopic("");
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

            {/* Journal Topic Selector */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Journal Topic
              </label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={selectedJournalTopic}
                onChange={(e) => setSelectedJournalTopic(e.target.value)}
              >
                <option value="">Choose a journal topic</option>
                {journalTopics.map((topic, index) => (
                  <option key={index} value={topic}>
                    {topic}
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
