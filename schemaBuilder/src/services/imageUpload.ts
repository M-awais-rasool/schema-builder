/**
 * Image upload service
 * In a production environment, you would integrate with services like:
 * - AWS S3
 * - Cloudinary
 * - Firebase Storage
 * - Your own image upload endpoint
 */

export interface ImageUploadResponse {
  url: string;
  publicId?: string;
}

/**
 * Compresses an image file to reduce size while maintaining quality
 */
export const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Mock image upload service
 * Replace this with your actual image upload implementation
 */
export const uploadImageToService = async (file: File): Promise<ImageUploadResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const compressedImage = await compressImage(file);
    
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedImage);
    });
    return {
      url: base64,
      publicId: `profile_${Date.now()}`
    };
  } catch (error) {
    throw new Error('Failed to upload image');
  }
};

/**
 * Validates image file
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; 
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 5MB'
    };
  }

  return { isValid: true };
};

/**
 * Production-ready image upload function
 * Uncomment and modify this when integrating with a real service
 */
/*
export const uploadToCloudinary = async (file: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id
  };
};
*/