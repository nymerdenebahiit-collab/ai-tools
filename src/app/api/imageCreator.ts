export const createFoodImage = async (prompt: string) => {
    try {
      const response = await fetch(
        "https://ai-tools-back-e3qy.onrender.com/api/create-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to create image");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating image:", error);
      throw error;
    }
  };