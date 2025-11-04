import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface UserListEntry {
  id: number;
  username: string;
  email: string;
  role: string;
}

const Dashboard = () => {
  useAuth();
  const [users, setUsers] = useState<UserListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
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

  if (loading) {
    return <div className="text-center mt-20">Loading user list...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto mt-8 sm:mt-16 p-6 sm:p-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Admin Dashboard</h1>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
