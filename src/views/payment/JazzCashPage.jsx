import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createOrderFromQrMenu, sendPaymentOTP, verifyPaymentOTP } from "../../controllers/qrmenu.controller";
import { useCafeCart } from "../../contexts/CafeCartContext";
import { IconCheck, IconX, IconLoader2, IconShieldCheck } from "@tabler/icons-react";

export default function JazzCashPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCafeCart();

  const amount = searchParams.get("amount") || "0.00";
  const currency = searchParams.get("currency") || "PKR";

  const [step, setStep] = useState("phone"); // phone → otp → simulation → processing → done
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  useEffect(() => {
    const pendingRaw = localStorage.getItem("cafe_pending_order");
    if (pendingRaw) {
      setPendingOrder(JSON.parse(pendingRaw));
    }
  }, []);

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!/^(03\d{9}|\+923\d{9})$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Enter a valid Pakistani mobile number (03xxxxxxxxx)");
      return;
    }

    if (!pendingOrder?.customerEmail) {
      toast.error("Customer email not found. Please re-login.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendPaymentOTP(pendingOrder.customerEmail);
      if (res.data?.success) {
        setStep("otp");
        toast.success("Verification OTP sent to " + pendingOrder.customerEmail);
        if (res.data.otp) {
          console.log("OTP:", res.data.otp);
        }
      }
    } catch (err) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyPaymentOTP(pendingOrder.customerEmail, otp);
      if (res.data?.success) {
        setStep("Verification");
        setTimeout(() => setStep("processing"), 3000);
      }
    } catch (err) {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (step === "processing") {
      processFinalOrder();
    }
  }, [step]);

  async function processFinalOrder() {
    const ref = "JC-" + Date.now();
    try {
      const res = await createOrderFromQrMenu(
        pendingOrder.deliveryType,
        pendingOrder.items.map(item => ({...item, addons_ids: item.addons?.map(a => a.id)})),
        "customer",
        { phone: pendingOrder.customerPhone, name: pendingOrder.customerName },
        pendingOrder.tableId || null,
        "JazzCash",
        ref,
        "default"
      );
      
      localStorage.removeItem("cafe_pending_order");
      clearCart();
      
      setTimeout(() => {
        toast.success("Payment successful! Reference: " + ref);
        navigate(`/orders/${res.data?.orderId || ''}`);
      }, 2000);
    } catch (err) {
      navigate("/payment/result?status=failed&gateway=jazzcash");
    }
  }

  function handleCancel() {
    localStorage.removeItem("cafe_pending_order");
    navigate("/checkout");
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col items-center justify-center px-4 font-sans">
      {/* JazzCash Official Simulation Look */}
      <div className="bg-white shadow-2xl w-full max-w-sm rounded-[32px] overflow-hidden">
        
        {/* Branding Header */}
        <div className="bg-[#D3122A] p-8 text-center relative">
          <div className="bg-white w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-4xl font-black text-[#D3122A]">JC</span>
          </div>
          <h2 className="text-white font-bold text-2xl uppercase tracking-tighter">JazzCash</h2>
          <p className="text-red-100 text-xs opacity-80 uppercase tracking-widest mt-1">Mobile Account Payment</p>
        </div>

        <div className="p-8">
          <div className="text-center mb-8 bg-gray-50 py-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total Payable</p>
            <p className="text-4xl font-black text-gray-800">
              <span className="text-lg font-normal text-gray-400 mr-1">Rs.</span>
              {parseFloat(amount).toLocaleString()}
            </p>
          </div>

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">JazzCash Number</label>
                <div className="relative">
                   <input
                    type="tel"
                    className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 font-bold text-lg focus:border-[#D3122A] focus:outline-none transition-all"
                    placeholder="03xxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#D3122A] hover:bg-[#b00e22] text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? <IconLoader2 className="animate-spin" /> : "Continue"}
              </button>
              <button type="button" onClick={handleCancel} className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors">Cancel Payment</button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-gray-600">Verify your identity</p>
                <p className="text-xs text-gray-400 px-4 leading-relaxed">
                  We've sent a 6-digit verification code to your email <span className="text-gray-700 font-bold">{pendingOrder?.customerEmail}</span>
                </p>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-3xl font-black tracking-[0.3em] focus:border-[#D3122A] focus:outline-none transition-all"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#D3122A] text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <IconLoader2 className="animate-spin" /> : "Verify & Pay"}
              </button>
              <button type="button" onClick={() => setStep("phone")} className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors">Change Number</button>
            </form>
          )}

          {step === "simulation" && (
            <div className="flex flex-col items-center gap-6 py-4 animate-pulse">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner border border-green-100">
                <IconShieldCheck size={48} stroke={1.5} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-bold text-xl text-gray-800 tracking-tight">Account Verified</h3>
                <p className="text-sm text-gray-400 px-4">Establishing a secure connection with JazzCash Payment Gateway...</p>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative">
                <IconLoader2 size={48} className="animate-spin text-[#D3122A]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-500/10 rounded-full animate-ping" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-bold text-xl text-gray-800 tracking-tight">Finalizing Payment</h3>
                <p className="text-sm text-gray-400 px-6 font-medium">Validating transaction with bank servers. Please do not close this window.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 uppercase font-bold tracking-widest">
             <IconShieldCheck size={12} /> SECURED BY JAZZCASH
           </p>
        </div>
      </div>
    </div>
  );
}
