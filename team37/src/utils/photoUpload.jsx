const resizeImage = (file, maxWidth = 300, quality = 0.6) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality)); // returns base64 with prefix
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };


  const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // ✅ keeps prefix
    reader.onload = () => resolve(reader.result); // ✅ no split
    reader.onerror = (error) => reject(error);
  });
};


  const uploadAndSetImage = async (file, setState, endpoint = "/api/upload-photo") => {
  try {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Please upload one under 2MB.");
      return;
    }

    const resizedBase64 = await resizeImage(file, 300, 0.6);
    console.log("🖼️ Preview base64:", resizedBase64.slice(0, 100));

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo: resizedBase64 }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Upload failed");

    setState(data.publicUrl);
  } catch (err) {
    console.error("Image upload error:", err);
    alert("Failed to upload image. Try again.");
  }
};

const uploadWithLoader = async (file) =>{
    setLoading(true);
    await uploadAndSetImage(file, setPhoto);
    setLoading(false);
}


export {toBase64, uploadAndSetImage, resizeImage, uploadWithLoader};