import { uploadBase64File } from "../utils/supabaseUpload.js";

export const handlePhotoUpload = async (req, res) => {
  const { photo } = req.body;
  console.log("[Photo Upload] Request received", { hasPhoto: !!photo });
  if (!photo) {
    console.warn("[Photo Upload] No photo data in request body");
    return res.status(400).json({ message: "No photo data" });
  }

  try {
    const publicUrl = await uploadBase64File(photo, "user-photos", false);
    console.log("[Photo Upload] Success", { publicUrl });
    res.status(200).json({ publicUrl });
  } catch (err) {
    console.error("[Photo Upload] Error:", err.message);
    res.status(500).json({ message: "Photo upload failed" });
  }
};

export const handleDocumentUpload = async (req, res) => {
  const { base64 } = req.body;
  console.log("[Document Upload] Request received", { hasBase64: !!base64 });
  if (!base64) {
    console.warn("[Document Upload] No document data in request body");
    return res.status(400).json({ message: "No document data" });
  }

  try {
    const signedUrl = await uploadBase64File(base64, "documents", true);
    console.log("[Document Upload] Success", { signedUrl });
    res.status(200).json({ publicUrl: signedUrl });
  } catch (err) {
    console.error("[Document Upload] Error:", err.message);
    res.status(500).json({ message: "Document upload failed" });
  }
};
