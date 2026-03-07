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
      navigate("/cafe/menu", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
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
              Create Account
            </h2>
            <p className="text-center text-sm text-base-content/60 mb-6">
              Join us to order online and track your orders
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

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
                  <span className="label-text">
                    Phone{" "}
                    <span className="text-base-content/40">(optional)</span>
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="input input-bordered"
                  placeholder="+1 234 567 8900"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
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
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input input-bordered"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
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
                  "Create Account"
                )}
              </button>
            </form>

            <div className="divider text-xs">Already have an account?</div>
            <Link to="/cafe/login" className="btn btn-outline w-full">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
