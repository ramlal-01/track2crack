import imageCompression from "browser-image-compression";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });

export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Use webp format for better compression, fallback to jpeg
  const format = "image/jpeg";
  const quality = 0.8; // Good balance between quality and file size
  const base64 = canvas.toDataURL(format, quality);

  // compress final image with optimized settings
  const blob = await fetch(base64).then((res) => res.blob());

  const compressed = await imageCompression(blob, {
    maxSizeMB: 0.3, // Reduced from 0.5 for faster uploads
    maxWidthOrHeight: 300,
    useWebWorker: true,
    initialQuality: 0.8 // Set initial quality
  });

  return compressed; // compressed Blob
}
