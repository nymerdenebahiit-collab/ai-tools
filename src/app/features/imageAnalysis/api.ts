export const uploadImageForAnalysis = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
  
      const response = await fetch(
        "https://ai-tools-back-e3qy.onrender.com/api/analyze-image",
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  