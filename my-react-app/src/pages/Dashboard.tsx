import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";

interface UserListEntry {
  id: number;
  username: string;
  email: string;
  role: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError("Failed to fetch users. You may not have permission.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (idToDelete: number) => {
    if (idToDelete === user?.id) {
      alert("You cannot delete your own account.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${idToDelete}`);
        setUsers(users.filter((u) => u.id !== idToDelete));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to update user role.");
      }
    }
  };

  const handleUpdateRole = async (idToUpdate: number, currentRole: string) => {
    if (idToUpdate === user?.id) {
      alert("You cannot change your own role.");
      return;
    }

    const newRole = currentRole === "user" ? "admin" : "user";
    if (window.confirm(`Change this user's role to "${newRole}"?`)) {
      try {
        await api.put(`/admin/users/${idToUpdate}`, { role: newRole });
        setUsers(
          users.map((u) => (u.id === idToUpdate ? { ...u, role: newRole } : u))
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to update user role.");
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newUser = {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole,
      };
      const res = await api.post("/admin/users", newUser);

      setUsers([...users, res.data.user]);
      setShowCreateForm(false);
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("user");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create user.");
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading user list...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto mt-8 sm:mt-16 p-6 sm:p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Admin Dashboard</h1>

      <div className="mb-4">
        <Link
          to="/profile"
          className="text-blue-600 hover:text-blue-800 transition duration-300 font-semibold text-sm"
        >
          &larr; Back to Profile
        </Link>
      </div>

      <div className="mt-6">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 mb-3 rounded-lg transition duration-300"
        >
          {showCreateForm ? "Cancel" : "+ Create New User!"}
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreateUser}
          className="flex flex-col space-x-4 p-6 mb-6 bg-gray-100 rounded-lg"
        >
          <h3 className="mb-3 text-xl font-semibold text-gray-700">
            New User Details
          </h3>

          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="p-3 mb-3 border rounded-lg"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="p-3 mb-3 border rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-3 mb-3 border rounded-lg"
            required
          />

          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="p-3 mb-3 border rounded-lg bg-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        User Management
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{u.id}</td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {u.username}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {u.email}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                  {u.role}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleUpdateRole(u.id, u.role)}
                    className="text-blue-600 hover:text-blue-900 disabled:text-gray-300"
                    // ปิดปุ่มถ้าเป็น Admin คนปัจจุบัน
                    disabled={u.id === user?.id}
                  >
                    {u.role === "user" ? "Make Admin" : "Make User"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="text-red-600 hover:text-red-900 disabled:text-gray-300"
                    // ปิดปุ่มถ้าเป็น Admin คนปัจจุบัน
                    disabled={u.id === user?.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
