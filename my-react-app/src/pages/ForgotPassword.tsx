import { useState, type FormEvent } from "react";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1. ยิง API ไปยัง Backend (Endpoint แรก)
      const res = await api.post("/auth/forgot-password", { email });

      // 2. แสดงข้อความสำเร็จ (จาก Backend)
      setMessage(res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md space-y-6 mt-8 sm:mt-12 p-6 sm:p-8 shadow-xl rounded-xl bg-white border border-gray-100"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Forgot Password
        </h2>
        {message && (
          <div className="p-4 text-center bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {!message && (
          <>
            <p className="text-center text-gray-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
