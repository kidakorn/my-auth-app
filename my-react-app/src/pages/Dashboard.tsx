import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
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
  // const [error, setError] = useState<string | null>(null);
  // const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [deletingUser, setDeletingUser] = useState<UserListEntry | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        // setError("Failed to fetch users. You may not have permission.");
        toast.error("Failed to fetch users", {
          description: err.response?.data?.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (idToDelete: number) => {
    if (idToDelete === user?.id) {
      // alert("You cannot delete your own account.");
      toast.error("You cannot delete your own account.");
      return;
    }

    try {
      await api.delete(`/admin/users/${idToDelete}`);
      setUsers(users.filter((u) => u.id !== idToDelete));
      toast.success("User Deleted", {
        description: "The user has been successfully deleted.",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // setError("Failed to update user role.");
      toast.error("Failed to delete user.");
    }
    setDeletingUser(null);
  };

  const handleUpdateRole = async (idToUpdate: number, currentRole: string) => {
    if (idToUpdate === user?.id) {
      // alert("You cannot change your own role.");
      toast.error("You cannot change your own role.");
      return;
    }

    const newRole = currentRole === "user" ? "admin" : "user";
    try {
      await api.put(`/admin/users/${idToUpdate}`, { role: newRole });
      setUsers(
         users.map((u) => (u.id === idToUpdate ? { ...u, role: newRole } : u))
      );
      toast.success("Role Updated", { description: `User role changed to ${newRole}.` });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // setError("Failed to update user role.");
      toast.error("Failed to update user role.");
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
      // setShowCreateForm(false);
      setIsCreateDialogOpen(false);
      toast.success("User Created", { description: `${newUser.username} has been added.` });
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("user");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // setError(err.response?.data?.message || "Failed to create user.");
      toast.error("Failed to create user", { description: err.response?.data?.message });
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading user list...</div>;
  }

  // if (error) {
  //   return <div className="text-center mt-20 text-red-500">{error}</div>;
  // }

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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-blue-700">Admin Dashboard</CardTitle>
            <CardDescription className="mt-2">Create and manage users.</CardDescription>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0">+ Create New User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new user account.
                </DialogDescription>
              </DialogHeader>
              {/* --- ฟอร์ม Create User --- */}
              <form onSubmit={handleCreateUser} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-username" className="text-right">Username</Label>
                  <Input id="new-username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-email" className="text-right">Email</Label>
                  <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-password" className="text-right">Password</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="new-role" className="text-right">Role</Label>
                  <Select onValueChange={setNewRole} defaultValue="user">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {/* --- 3. ส่วนตาราง (ใช้ Card) --- */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          {/* (ลบ Error P tag ทิ้ง) */}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading user list...</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              {/* --- 9. ตาราง shadcn/ui --- */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="hidden sm:table-cell">{u.id}</TableCell>
                      <TableCell className="font-medium">{u.username}</TableCell>
                      <TableCell className="hidden md:table-cell">{u.email}</TableCell>
                      <TableCell className="capitalize">{u.role}</TableCell>
                      
                      {/* --- 10. ปุ่ม Actions (DropdownMenu) --- */}
                      <TableCell className="text-right">
                        {u.id === user?.id ? (
                          <span className="text-xs text-muted-foreground">Current Admin</span>
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
                              <DropdownMenuItem onClick={() => handleUpdateRole(u.id, u.role)}>
                                {u.role === "user" ? "Make Admin" : "Make User"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeletingUser(u)} className="text-destructive focus:text-destructive">
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
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
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
