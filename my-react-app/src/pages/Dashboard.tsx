import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";

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
  const [deletingUser, setDeletingUser] = useState<UserListEntry | null>(null);

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
    <div className="w-full max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto mt-8 sm:mt-16 p-6 sm:p-8">
      {/* ปุ่ม Back to Profile */}
      <div className="mb-4">
        <Button variant="link" asChild className="p-0 h-auto">
          <Link to="/profile">&larr; Back to Profile</Link>
        </Button>
      </div>

      {/* --- ส่วนฟอร์ม Create User (ใช้ Card) --- */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>Create and manage users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant={showCreateForm ? "secondary" : "default"}
          >
            {showCreateForm ? "Cancel" : "+ Create New User"}
          </Button>

          {showCreateForm && (
            <form
              onSubmit={handleCreateUser}
              className="flex flex-col space-y-4 mt-6 p-6 bg-muted rounded-lg"
            >
              <h3 className="text-xl font-semibold text-card-foreground">
                New User Details
              </h3>
              {/* (Input Fields เดิม) */}
              <div className="space-y-2">
                <Label htmlFor="new-username">Username</Label>
                <Input
                  id="new-username"
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              {/* (Select Role) */}
              <Button type="submit" className="pt-4">
                Submit
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* --- 3. ส่วนตาราง (ใช้ Card) --- */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading user list...</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="hidden sm:table-cell">
                        {u.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {u.username}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {u.email}
                      </TableCell>
                      <TableCell className="capitalize">{u.role}</TableCell>

                      {/* --- 4. ปุ่ม Actions (DropdownMenu) --- */}
                      <TableCell className="text-right">
                        {/* ปิดปุ่มถ้าเป็น Admin คนปัจจุบัน */}
                        {u.id === user?.id ? (
                          <span className="text-xs text-muted-foreground">
                            Current Admin
                          </span>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(u.id, u.role)}
                              >
                                {u.role === "user" ? "Make Admin" : "Make User"}
                              </DropdownMenuItem>
                              {/* เปิด Dialog ยืนยันการลบ */}
                              <DropdownMenuItem
                                onClick={() => setDeletingUser(u)}
                                className="text-destructive"
                              >
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- 5. Dialog ยืนยันการลบ --- */}
      <AlertDialog
        open={!!deletingUser}
        onOpenChange={() => setDeletingUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user{" "}
              <span className="font-medium">{deletingUser?.username}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingUser) {
                  handleDeleteUser(deletingUser.id);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
