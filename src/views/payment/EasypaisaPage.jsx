import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createOrderFromQrMenu, sendPaymentOTP, verifyPaymentOTP } from "../../controllers/qrmenu.controller";
import { useCafeCart } from "../../contexts/CafeCartContext";
import { IconCheck, IconX, IconLoader2, IconShieldCheck, IconLeaf } from "@tabler/icons-react";

export default function EasypaisaPage() {
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
          console.log("SIMULATION OTP:", res.data.otp);
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
        setStep("simulation");
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
    const ref = "EP-" + Date.now();
    try {
      const res = await createOrderFromQrMenu(
        pendingOrder.deliveryType,
        pendingOrder.items.map(item => ({...item, addons_ids: item.addons?.map(a => a.id)})),
        "customer",
        { phone: pendingOrder.customerPhone, name: pendingOrder.customerName },
        pendingOrder.tableId || null,
        "EasyPaisa",
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
      navigate("/payment/result?status=failed&gateway=easypaisa");
    }
  }

  function handleCancel() {
    localStorage.removeItem("cafe_pending_order");
    navigate("/checkout");
  }

  return (
    <div className="min-h-screen bg-[#F0F7F2] flex flex-col items-center justify-center px-4 font-sans text-[#1D3D2E]">
      {/* Easypaisa Official Simulation Look */}
      <div className="bg-white shadow-2xl w-full max-w-sm rounded-[32px] overflow-hidden border-t-8 border-[#3BB54A]">
        
        {/* Branding Header */}
        <div className="p-8 text-center bg-white">
          <div className="bg-[#3BB54A] w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
            <IconLeaf size={48} className="text-white" stroke={2} />
          </div>
          <h2 className="text-[#3BB54A] font-black text-3xl tracking-tight">easypaisa</h2>
          <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mt-1">Simpler. Freer. Smarter.</p>
        </div>

        <div className="px-8 pb-8">
          <div className="text-center mb-8 bg-[#3BB54A]/5 py-6 rounded-3xl border border-[#3BB54A]/10">
            <p className="text-[10px] text-[#3BB54A]/60 uppercase font-black tracking-widest mb-1">Total Payment</p>
            <p className="text-4xl font-black text-[#1D3D2E]">
              <span className="text-lg font-medium opacity-40 mr-1">Rs.</span>
              {parseFloat(amount).toLocaleString()}
            </p>
          </div>

          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2 text-center">
                <label className="text-[11px] font-black text-gray-400 uppercase">Easypaisa Mobile Account</label>
                <div className="relative">
                   <input
                    type="tel"
                    className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 text-center font-black text-xl focus:border-[#3BB54A] focus:bg-white focus:outline-none transition-all placeholder:text-gray-200"
                    placeholder="0300 0000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-[#3BB54A] hover:bg-[#2e8f3a] text-white rounded-2xl font-black text-lg shadow-xl shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? <IconLoader2 className="animate-spin" /> : "PAY SECURELY"}
              </button>
              <button type="button" onClick={handleCancel} className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors">Go Back</button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 text-[#3BB54A]">
                  <IconShieldCheck size={28} />
                </div>
                <p className="text-sm font-black text-gray-700 uppercase tracking-tight">Security Verification</p>
                <p className="text-xs text-gray-400 px-4 leading-relaxed">
                  Please enter the 6-digit verification code sent to your email <span className="text-[#3BB54A] font-bold">{pendingOrder?.customerEmail}</span>
                </p>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  className="w-full h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-3xl font-black tracking-[0.3em] focus:border-[#3BB54A] focus:bg-white focus:outline-none transition-all"
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
                className="w-full h-16 bg-[#3BB54A] text-white rounded-2xl font-black text-lg shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <IconLoader2 className="animate-spin" /> : "CONTINUE PAYMENT"}
              </button>
              <button type="button" onClick={() => setStep("phone")} className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors underline underline-offset-4">Wrong Number?</button>
            </form>
          )}

          {step === "simulation" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative">
                <div className="w-24 h-24 bg-green-50 text-[#3BB54A] rounded-full flex items-center justify-center animate-bounce">
                  <IconLeaf size={56} stroke={1.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#3BB54A] text-white rounded-full flex items-center justify-center border-4 border-white">
                  <IconCheck size={18} stroke={3} />
                </div>
              </div>
              <div className="text-center space-y-2 px-2">
                <h3 className="font-black text-2xl text-[#1D3D2E] tracking-tight">Authenticated!</h3>
                <p className="text-sm text-gray-400">Your account is secured. Initializing payment of PKR {amount} through encrypted channel...</p>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative">
                <IconLoader2 size={64} className="animate-spin text-[#3BB54A]" stroke={3} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-[#3BB54A]/10 rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-black text-xl text-gray-800 uppercase tracking-tighter">Processing Payment</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest px-4">Authorized by Telenor Microfinance Bank</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100 flex flex-col items-center gap-2">
           <img src="https://easypaisa.com.pk/wp-content/uploads/2021/04/ep-logo.png" className="h-6 grayscale opacity-30" alt="Easypaisa" />
           <p className="text-[9px] text-gray-400 uppercase font-black tracking-[0.2em]">Partnered with OCOS Systems</p>
        </div>
      </div>
    </div>
  );
}
