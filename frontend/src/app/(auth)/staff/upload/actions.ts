"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function getStudents() {
  const supabase = await createClient();

  try {
    const { data: students, error } = await supabase
      .from("students")
      .select("student_id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching students:", error.message);
      return { data: null, error: error.message };
    }

    return { data: students, error: null };
  } catch (err: any) {
    console.error("Unexpected error fetching students:", err.message);
    return { data: null, error: err.message };
  }
}

export async function uploadNotes(formData: FormData) {
  const supabase = await createClient();

  // Authenticate user
  const { data: userData, error: userFetchError } = await supabase.auth.getUser();
  if (userFetchError || !userData?.user) {
    redirect("/login");
  }

  try {
    const file = formData.get("file") as File;
    const student_id = (formData.get("student_id") || "").toString();

    if (!file || !student_id) {
      return { ok: false, error: "Missing file or student id." };
    }

    // Generate unique file path
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${student_id}_${timestamp}.${fileExt}`;
    const filePath = `notes/${fileName}`;

    // 1️⃣ Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("notes")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) return { ok: false, error: uploadError.message };

    // 2️⃣ Get public URL
    const { data: publicUrlData } = supabase.storage.from("notes").getPublicUrl(filePath);
    const fileUrl = publicUrlData?.publicUrl;
    if (!fileUrl) return { ok: false, error: "Failed to get file URL." };

    // 3️⃣ Call your FastAPI backend to extract text
    const response = await fetch("http://127.0.0.1:8000/notes/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id, file_url: fileUrl }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { ok: false, error: `OCR service error: ${errText}` };
    }

    const data = await response.json();
    // data: { beneficiary_name: string, extracted_text: string }
    return { ok: true, extracted_text: data.extracted_text, beneficiary_name: data.beneficiary_name };
    
  } catch (err: any) {
    console.error("Unexpected error:", err.message);
    return { ok: false, error: "Unexpected error during upload." };
  }
}