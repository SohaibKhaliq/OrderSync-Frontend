import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CustomerAccounts } from "../../localdb/LocalDB";
import { useCustomer } from "../../contexts/CustomerContext";

export default function CafeRegisterPage() {
  const navigate = useNavigate();
  const { login } = useCustomer();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email and password are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const account = CustomerAccounts.register(
        form.name,
        form.email,
        form.password,
        form.phone,
      );
      // Auto-login after registration
      const session = CustomerAccounts.login(form.email, form.password);
      login(session);
      toast.success(`Welcome, ${account.name}!`);
      navigate("/menu", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
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
              Create Account
            </h2>
            <p className="text-sm font-medium text-neutral opacity-70">
              Join us to order online and track your delicious food.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="form-control">
              <label className="label pb-2">
                <span className="text-sm font-bold text-secondary uppercase tracking-wider">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="w-full h-12 rounded-xl pl-4 pr-4 bg-gray-50 border border-gray-200 text-secondary focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

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
                <span className="text-sm font-bold text-secondary uppercase tracking-wider">
                  Phone <span className="text-neutral/40 font-normal normal-case">(optional)</span>
                </span>
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full h-12 rounded-xl pl-4 pr-4 bg-gray-50 border border-gray-200 text-secondary focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                placeholder="+1 234 567 8900"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="text-sm font-bold text-secondary uppercase tracking-wider">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full h-12 rounded-xl pl-4 pr-4 bg-gray-50 border border-gray-200 text-secondary focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
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
                "Create Account"
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-bold text-neutral opacity-50 uppercase tracking-widest">Already a user?</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <Link to="/login" className="btn btn-outline border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl w-full h-14 min-h-0 font-bold text-lg transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
