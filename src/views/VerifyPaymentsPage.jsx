import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import { getUnverifiedPayments, verifyPayment } from "../controllers/orders.controller";
import { toast } from "react-hot-toast";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";
import { iconStroke } from "../config/config";
import { clsx } from "clsx";

export default function VerifyPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await getUnverifiedPayments();
      if (res.data?.success) {
        setPayments(res.data.payments);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pending payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to verify this payment? This will mark the order as PAID.");
    if (!isConfirm) return;

    try {
      toast.loading("Verifying...");
      const res = await verifyPayment(id);
      if (res.data?.success) {
        toast.dismiss();
        toast.success(res.data.message);
        fetchPayments();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to verify payment");
    }
  };

  return (
    <Page>
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Manual Payment Verification</h3>
        <button 
          onClick={fetchPayments}
          className="btn btn-sm btn-ghost border-gray-200"
        >
          Refresh
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3 items-start">
        <IconInfoCircle className="text-blue-500 shrink-0" stroke={iconStroke} />
        <p className="text-sm text-blue-700">
          These are orders placed via the QR Menu using online payment methods (JazzCash, EasyPaisa, etc.). 
          Please verify the transaction ID/Reference in your merchant account before clicking <strong>Verify</strong>.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400">No pending payments to verify.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div key={payment.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={clsx("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 inline-block", {
                      "bg-orange-100 text-orange-600": payment.payment_method === 'JazzCash',
                      "bg-green-100 text-green-600": payment.payment_method === 'EasyPaisa',
                      "bg-blue-100 text-blue-600": payment.payment_method === 'Stripe',
                      "bg-gray-100 text-gray-600": payment.payment_method === 'cash',
                      "bg-purple-100 text-purple-600": payment.payment_method === 'wallet',
                    })}>
                      {payment.payment_method}
                    </span>
                    <h4 className="font-bold text-lg">{payment.customer_name || "Guest"}</h4>
                    <p className="text-xs text-gray-400">{payment.customer_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">Rs: {parseFloat(payment.total || 0).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{new Date(payment.date).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Transaction Ref</p>
                  <p className="font-mono text-sm break-all font-bold text-gray-700">{payment.payment_ref || "N/A"}</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleVerify(payment.id)}
                    className="flex-1 btn btn-primary text-white gap-2"
                  >
                    <IconCheck size={18} stroke={iconStroke} /> Verify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
