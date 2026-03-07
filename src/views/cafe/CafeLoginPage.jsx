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

  const from = location.state?.from?.pathname || "/menu";

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
    <div className="bg-theme-light flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-primary/10 w-full max-w-md overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-secondary mb-2">
              Welcome Back
            </h2>
            <p className="text-sm font-medium text-neutral opacity-70">
              Sign in to your account to order online and track your orders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="form-control">
              <label className="label pb-2">
                <span className="text-sm font-bold text-secondary uppercase tracking-wider">Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                className="w-full h-12 rounded-xl pl-4 pr-4 bg-gray-50 border border-gray-200 text-secondary focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="text-sm font-bold text-secondary uppercase tracking-wider">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="w-full h-12 rounded-xl pl-4 pr-4 bg-gray-50 border border-gray-200 text-secondary focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full h-14 min-h-0 rounded-xl mt-4 text-white font-bold text-lg border-0 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-bold text-neutral opacity-50 uppercase tracking-widest">New here?</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <Link to="/register" className="btn btn-outline border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl w-full h-14 min-h-0 font-bold text-lg transition-colors">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
