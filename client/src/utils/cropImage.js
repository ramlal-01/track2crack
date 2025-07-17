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

  const base64 = canvas.toDataURL("image/jpeg");

  // compress final image
  const blob = await fetch(base64).then((res) => res.blob());

  const compressed = await imageCompression(blob, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 300,
    useWebWorker: true,
  });

  return compressed; // compressed Blob
}
