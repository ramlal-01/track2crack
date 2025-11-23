import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import React, { useState, useCallback } from "react";
import Modal from "react-modal";
// change the Avatar
const AvatarCropper = ({ image, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onCropDone(croppedImage);
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
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            Crop & Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarCropper;
