import React, { useState } from "react";

const ImageToBase64 = () => {
  const [base64Image, setBase64Image] = useState("");

  // Function to handle image upload, resize it and convert to base64
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Create an image element to load the uploaded image
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          // Resize the image using canvas
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set new width and height for the resized image
          const maxWidth = 500; // Max width for resizing
          const scale = maxWidth / img.width;
          const newHeight = img.height * scale;
          canvas.width = maxWidth;
          canvas.height = newHeight;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Get the Base64 encoded image from the canvas
          const resizedBase64 = canvas.toDataURL("image/png");
          setBase64Image(resizedBase64);
          console.log(resizedBase64);
          // Set the resized Base64 image
        };
      };
      reader.onerror = (error) => {
        console.error("Error converting image to Base64: ", error);
      };
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {base64Image && (
        <div>
          <h3>Resized Base64 Image Preview:</h3>
          <img src={base64Image} alt="Resized" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default ImageToBase64;
