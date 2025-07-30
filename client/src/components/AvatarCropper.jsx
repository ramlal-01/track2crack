import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import Modal from "react-modal";

const AvatarCropper = ({ image, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropDone(croppedImage);
    } catch (error) {
      console.error("Crop processing failed:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      overlayClassName=""
      ariaHideApp={false}
    >
      <div className="bg-gray-900 p-6 rounded-xl w-[90%] md:w-[400px] text-white relative">
        <h2 className="mb-4 text-lg font-semibold">Crop your Avatar</h2>
        <p className="text-sm text-gray-300 mb-4">Drag and zoom to adjust your image</p>
        
        <div className="relative w-full h-64 bg-gray-800">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={isProcessing}
            className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Crop & Save"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarCropper;
