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
    formData.append("avatar", croppedBlob); // ✅ Upload the cropped blob

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


  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">Edit Profile</h2>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
        {/* Avatar Upload */}
        <form
          onSubmit={handleAvatarUpload}
          className="w-full lg:w-1/3 border border-gray-700 bg-gray-900 p-6 rounded-xl shadow"
        >
          <label className="block mb-2 text-white font-medium">Upload Profile Picture</label>
          <p className="text-sm text-gray-400 mb-3">JPG or PNG, no larger than 5MB</p>
          <div className="flex flex-col gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (file.size > 5 * 1024 * 1024) {
                  return alert("File too large. Max 5MB allowed.");
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                  setPreviewImage(reader.result); // base64 to show in cropper
                };
                reader.readAsDataURL(file);
              }}
              className="text-sm text-white"
            />


            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            >
              Update Avatar
            </button>
          </div>
        </form>

        {/* Profile Details Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-2/3 space-y-4 bg-gray-900 p-6 rounded-xl shadow"
        >
          <div>
            <label className="text-white block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="text-white block mb-1">College</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-white block mb-1">DOB</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="text-white block mb-1">GitHub</label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>

          <div>
            <label className="text-white block mb-1">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
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
