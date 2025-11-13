import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false); // State สลับโหมด View/Edit
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  // const [error, setError] = useState<string | null>(null);

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
    // setError(null);
    try {
      await updateProfile(formData.username, formData.email);
      setIsEditing(false);

      toast.success("Profile Update", {
        description: "Your profile has been successfully updated.",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err.response?.data?.message || "Failed to update profile.",
      });
      // setError(err.response?.data?.message || "Failed to update profile.");
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
    // setError(null);
  };

  if (!user) {
    return (
      <div className="text-center mt-20 text-lg">Loading user data...</div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        {isEditing ? (
          // --- โหมดแก้ไข (Edit Mode) ---
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )} */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 mb-6">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" className="w-full sm:w-auto">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
            </CardFooter>
          </form>
        ) : (
          // --- โหมดแสดงผล (View Mode) ---
          <>
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold">User Profile</CardTitle>
              <CardDescription>Your personal account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg space-y-4">
                <div className="flex flex-col md:flex-row md:items-baseline">
                  <span className="font-semibold text-muted-foreground w-full md:w-32 shrink-0">
                    Username:
                  </span>
                  <span className="font-medium wrap-break-word">{user.username}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline">
                  <span className="font-semibold text-muted-foreground w-full md:w-32 shrink-0">
                    Email:
                  </span>
                  <span className="font-medium wrap-break-word">{user.email}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-baseline">
                  <span className="font-semibold text-muted-foreground w-full md:w-32 shrink-0">
                    Role:
                  </span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-4">
              <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                Edit Profile
              </Button>
              {user.role === "admin" && (
                <Button asChild variant="outline" className="w-full bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white sm:w-auto">
                  <Link to="/dashboard">Go to Admin Dashboard</Link>
                </Button>
              )}
              <Button onClick={logout} variant="destructive" className="w-full sm:w-auto sm:ml-auto">
                Logout
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default Profile;
