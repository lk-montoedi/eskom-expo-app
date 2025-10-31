import { supabase } from "../config/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

export const uploadBase64File = async (base64String, bucket = "documents") => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 file");

  const [, mimeType, base64Data] = matches;
  const buffer = Buffer.from(base64Data, "base64");
  const fileExt = mimeType.split("/")[1] || "bin";
  const fileName = `${uuidv4()}.${fileExt}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) {
    console.error("Supabase Upload Error:", uploadError);
    throw uploadError;
  }

  // ✅ Determine privacy logic based on bucket name
  const isPrivate = !["user-photos"].includes(bucket); // Treat all others as private

  if (isPrivate) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, 60 * 60); // 1 hour signed URL
    if (error) throw error;
    return data.signedUrl;
  } else {
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }
};

