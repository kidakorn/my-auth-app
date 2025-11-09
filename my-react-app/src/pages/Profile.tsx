import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, type FormEvent } from "react";

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false); // State สลับโหมด View/Edit
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);

  // เมื่อ User (จาก Context) โหลดเสร็จ ให้ตั้งค่าเริ่มต้นให้ฟอร์ม
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  // ฟังก์ชันเมื่อกด "Save"
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updateProfile(formData.username, formData.email);
      setIsEditing(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // ฟังก์ชันเมื่อกด "Cancel"
  const handleCancel = () => {
    setIsEditing(false);

    // Reset ฟอร์มกลับไปเป็นค่าเดิมของ user
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
    setError(null);
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-lg">Loading user data...</div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 sm:mt-16 p-6 sm:p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
      {/* --- โหมดแก้ไข (Edit Mode) --- */}
      {isEditing ? (
        <form onSubmit={handleSave}>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-blue-700 border-b pb-4">
            Edit Profile
          </h1>

          {error && (
            <div className="my-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6 mt-8">
            <div className="flex flex-col text-lg">
              <label
                htmlFor="username"
                className="font-semibold text-gray-600 mb-1"
              >
                Username:
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="flex flex-col text-lg">
              <label
                htmlFor="email"
                className="font-semibold text-gray-600 mb-1"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-10">
            <button
              type="submit"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-blue-700 border-b pb-4">
            User Profile
          </h1>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row text-lg">
              <span className="font-semibold text-gray-600 w-full md:w-32 mb-1 md:mb-0">
                Username:
              </span>
              <span className="text-gray-900 font-medium">{user.username}</span>
            </div>

            <div className="flex flex-col md:flex-row text-lg">
              <span className="font-semibold text-gray-600 w-full md:w-32 mb-1 md:mb-0">
                Email:
              </span>
              <span className="text-gray-900 font-medium">{user.email}</span>
            </div>

            <div className="flex flex-col md:flex-row text-lg">
              <span className="font-semibold text-gray-600 w-full md:w-32 mb-1 md:mb-0">
                Role:
              </span>
              <span className="text-gray-900 font-medium capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>

            {user.role === "admin" && (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Go to Admin Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
