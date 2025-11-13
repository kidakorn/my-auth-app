import { useState, type FormEvent } from "react";
import api from "../services/api";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  // const [message, setMessage] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // setError(null);
    // setMessage(null);

    try {
      // 1. ยิง API ไปยัง Backend (Endpoint แรก)
      const res = await api.post("/auth/forgot-password", { email });

      // 2. แสดงข้อความสำเร็จ (จาก Backend)
      // setMessage(res.data.message);
      toast.success("Email Sent", {
        description: res.data.message,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // setError(err.response?.data?.message || "An error occurred.");
      toast.error("Error", {
        description: err.response?.data.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center mb-4">
              Forgot Password
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* {message && (
              <div className="p-4 text-center bg-green-100 text-green-700 rounded-lg">
                {message}
              </div>
            )}
            {error && (
              <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )} */}

            {/* {!message && ( */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            {/* )} */}
          </CardContent>

          <CardFooter className="flex flex-col gap-6 mt-2">
            {/* {!message && ( */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            {/* )} */}

            <p className="text-center text-sm text-muted-foreground">
              Remembered your password?{" "}
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

export default ForgotPassword;
