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

    const formData = new FormData();
    formData.append("avatar", croppedBlob);

    try {
      const token = localStorage.getItem("token");
      await API.post(`/users/avatar/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Avatar updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Avatar Upload Failed:", err);
      alert("Failed to upload avatar");
    }
  };
const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return alert("File too large. Max 5MB allowed.");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <p className="text-blue-100">Update your personal information</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 p-6">
          {/* Avatar Upload Section */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
              
              <div className="relative group mb-4">
                {currentAvatar ? (
                  <>
                    <img 
                      src={currentAvatar} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <label className="absolute inset-0 flex items-center justify-center w-32 h-32 rounded-full bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
                  <label className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center cursor-pointer relative shadow-md">
                    <span className="text-blue-500 text-3xl font-bold">+</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mb-4 text-center">JPG or PNG, no larger than 5MB</p>
              
              <button
                onClick={handleAvatarUpload}
                disabled={!croppedBlob}
                className={`px-6 py-2 text-white rounded-full w-full font-medium shadow-md transition-all ${
                  croppedBlob 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Update Avatar
              </button>
            </div>
          </div>

          {/* Profile Details Form */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <input
                    type="text"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
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