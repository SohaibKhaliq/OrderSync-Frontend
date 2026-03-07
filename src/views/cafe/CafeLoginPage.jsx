import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { CustomerAccounts } from "../../localdb/LocalDB";
import { useCustomer } from "../../contexts/CustomerContext";

export default function CafeLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useCustomer();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/cafe/menu";

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const account = CustomerAccounts.login(form.email, form.password);
      login(account);
      toast.success(`Welcome back, ${account.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Navbar */}
      <nav className="navbar bg-base-200 shadow-sm px-6">
        <Link to="/cafe" className="text-xl font-bold text-primary">
          ← Back to Home
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card bg-base-200 shadow-lg w-full max-w-md">
          <div className="card-body">
            <h2 className="card-title text-2xl justify-center mb-2">
              Customer Login
            </h2>
            <p className="text-center text-sm text-base-content/60 mb-6">
              Sign in to your account to order online
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className="input input-bordered"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="divider text-xs">Don't have an account?</div>
            <Link to="/cafe/register" className="btn btn-outline w-full">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
