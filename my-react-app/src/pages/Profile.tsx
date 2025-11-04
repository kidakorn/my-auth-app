import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="text-center mt-20 text-lg">Loading user data...</div>
    );
  }

  return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto mt-8 sm:mt-16 p-6 sm:p-10 bg-white shadow-2xl rounded-xl border border-gray-200">
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

        {user?.role === "admin" && (
          <Link
            to="/dashboard"
            className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 text-center"
          >
            Go to Admin Dashboard
          </Link>
        )}
      </div>

      <button
        onClick={logout}
        className="mt-10 w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
