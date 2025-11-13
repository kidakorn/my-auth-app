import { useState, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 2. ตรวจสอบว่ารหัสผ่านตรงกัน
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      // setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    // setError(null);
    setMessage(null);

    try {
      // 3. ยิง API ไปยัง Endpoint ที่ 2 (ส่ง Token ไปใน URL)
      const res = await api.post(`/auth/reset-password/${token}`, { password });

      // 4. แสดงข้อความสำเร็จ และเตรียมส่งกลับไปหน้า Login
      setMessage(res.data.message + " Redirecting to login in 3 seconds...");

      // (Toast จะแสดงผลใน App.tsx ตอนเราเรียกใช้)
      toast.success("Password Reset Successful", {
        description: res.data.message,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000); // 3 วินาที

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // 5. แสดง Error (เช่น Token หมดอายุ หรือไม่ถูกต้อง)
      // setError(err.response?.data?.message || "An error occurred.");
      toast.error("Reset Failed", {
        description: err.response?.data?.message || "An error occurred.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center">
              Set New Password
            </CardTitle>
            <CardDescription className="text-center pt-2">
              Please enter your new password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {message && (
              <div className="p-4 text-center bg-green-100 text-green-700 rounded-lg">
                {message}
              </div>
            )}
            {/* {error && (
              <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )} */}

            {/* ถ้ายังไม่สำเร็จ (ไม่มี message) ให้แสดงฟอร์ม */}
            {!message && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-6 mt-4">
            {!message && (
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Setting..." : "Set New Password"}
              </Button>
            )}

            <p className="text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
