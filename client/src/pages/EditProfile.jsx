import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import AvatarCropper from "../components/AvatarCropper"; 

const EditProfile = () => {
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    phone: "",
    gender: "",
    dob: "",
    github: "",
    linkedin: ""
  }); 
  
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileSize, setSelectedFileSize] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data;
        setFormData({
          name: user.name || "",
          college: user.college || "",
          phone: user.phone || "",
          gender: user.gender || "",
          dob: user.dob ? user.dob.split("T")[0] : "",
          github: user.github || "",
          linkedin: user.linkedin || "",
        });
         if (user.avatar) {
          setCurrentAvatar(user.avatar);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      return alert("Name and phone are required.");
    }

    try {
      const token = localStorage.getItem("token");
      await API.put(`/users/profile/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile");
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();

    if (!croppedBlob) return alert("Please crop and save your image first");

    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append("avatar", croppedBlob);

    try {
      const token = localStorage.getItem("token");
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);

      const response = await API.post(`/users/avatar/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update the current avatar with the new URL
      setCurrentAvatar(response.data.avatarUrl);
      setCroppedBlob(null);
      setSelectedFileName("");
      setSelectedFileSize("");
      
      setTimeout(() => {
        alert("Avatar updated successfully");
        navigate("/profile");
      }, 500);
      
    } catch (err) {
      console.error("Avatar Upload Failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to upload avatar";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPG, PNG, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return alert("File too large. Max 5MB allowed.");
    }

    // Set the file name and size
    setSelectedFileName(file.name);
    setSelectedFileSize((file.size / (1024 * 1024)).toFixed(2));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden w-full">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#000C40] to-[#F0F2F0] dark:from-gray-800 dark:to-gray-700 md:p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold">Edit Profile</h2>
            <p className="text-blue-100 dark:text-gray-300 mt-2">Update your personal information</p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-8">
            {/* Avatar Upload Section */}
            <div className="w-full lg:w-1/3 bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="flex flex-col items-center h-full">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Profile Picture</h3>
                
                <div 
                  className="relative group mb-6 flex-grow flex flex-col items-center justify-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {currentAvatar ? (
                    <>
                      <img 
                        src={currentAvatar} 
                        alt="Profile" 
                        className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                      <label className="absolute inset-0 flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="text-white text-2xl bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">+</div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  ) : (
                    <label className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-600 dark:to-gray-500 flex items-center justify-center cursor-pointer relative shadow-lg border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <div className="text-center">
                        <span className="text-blue-500 dark:text-blue-300 text-4xl font-bold block mb-2">+</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">Click or drag image here</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                {/* File name display */}
                {selectedFileName && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Selected file:</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 truncate">{selectedFileName}</p>
                    <p className="text-xs text-blue-500 dark:text-blue-400">Size: {selectedFileSize} MB</p>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">JPG or PNG, no larger than 5MB</p>
                
                {isUploading && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleAvatarUpload}
                  disabled={!croppedBlob || isUploading}
                  className={`px-6 py-3 text-white rounded-full w-full font-medium shadow-md transition-all ${
                    croppedBlob && !isUploading
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
                      : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    "Update Avatar"
                  )}
                </button>
              </div>
            </div>

            {/* Profile Details Form */}
            <div className="w-full lg:w-2/3 bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Personal Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">College</label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="px-8 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {previewImage && (
        <AvatarCropper
          image={previewImage}
          onClose={() => setPreviewImage(null)}
          onCropDone={(blob) => {
            setCroppedBlob(blob);
            setPreviewImage(null);
          }}
        />
      )}
    </div>
  );
};

export default EditProfile;