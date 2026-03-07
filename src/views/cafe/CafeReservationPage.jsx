import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCustomer } from "../../contexts/CustomerContext";
import { addNotification } from "../../hooks/useNotifications";
import { getDB, saveDB } from "../../localdb/LocalDB";

export default function CafeReservationPage() {
  const navigate = useNavigate();
  const { customer, login } = useCustomer();
  // Always call all hooks unconditionally at the top of the component
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);

  // Form state
  const [form, setForm] = useState({
    date: "",
    time: "",
    peopleCount: "2",
    tableId: searchParams.get("tableId") || "",
    notes: "",
    name: customer?.name || "",
    phone: customer?.phone || "",
  });

  useEffect(() => {
    // Load store tables from localdb
    try {
      const db = getDB();
      setTables(db.store_tables || []);
    } catch (err) {
      console.error("Failed to load tables", err);
    }
    
    // Auto-fill tomorrow's date at 7 PM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    
    setForm((prev) => ({ 
      ...prev, 
      date: dateStr, 
      time: "19:00"
    }));
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.time || !form.peopleCount || !form.name || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const db = getDB();
      db.reservations = db.reservations || [];
      
      const reservationId = Date.now() + Math.floor(Math.random() * 1000);
      const combinedDateTime = `${form.date}T${form.time}:00`;
      
      let tableTitle = "Any Table";
      if (form.tableId) {
        const t = tables.find(x => String(x.id) === String(form.tableId));
        if (t) tableTitle = t.title;
      }
      
      const newReservation = {
        id: reservationId,
        customer_id: customer?.id || "GUEST",
        customer_name: form.name,
        customer_phone: form.phone,
        date: combinedDateTime,
        table_id: form.tableId || null,
        table_title: tableTitle,
        status: "booked",
        notes: form.notes,
        people_count: parseInt(form.peopleCount),
        unique_code: `RES-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      db.reservations.push(newReservation);
      saveDB(db);

      // Add Notification for Admin
      addNotification({
        userId: "admin",
        forAdmin: true,
        message: `New reservation: ${form.peopleCount} pax for ${form.name} on ${new Date(combinedDateTime).toLocaleString()}`,
        type: 'info'
      });

      // Add Notification for Customer (if logged in)
      if (customer?.id) {
        addNotification({
          userId: customer.id,
          message: `Your reservation for ${form.peopleCount} people on ${new Date(combinedDateTime).toLocaleDateString()} has been confirmed.`,
          type: 'success'
        });
      }

      toast.success("Reservation confirmed!");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to book reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-12 pb-24 bg-theme-light flex-1 flex flex-col items-center">
      <div className="w-full max-w-4xl px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="text-primary font-bold tracking-widest text-xs mb-4 uppercase">Experience Dining</p>
          <h1 className="text-5xl font-serif font-bold text-secondary mb-4">Book a Table</h1>
          <p className="text-neutral opacity-70 max-w-2xl mx-auto">
            Reserve your spot for an unforgettable culinary experience. Whether it's a romantic dinner or a gathering with friends, we've got the perfect table for you.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-primary/10 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            
            <div className="md:col-span-2 mb-2">
              <h3 className="text-xl font-serif font-bold text-secondary border-b border-gray-100 pb-2">Reservation Details</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">Date *</label>
              <input 
                type="date" 
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary" 
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">Time *</label>
              <input 
                type="time" 
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary" 
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">Guests *</label>
              <select 
                name="peopleCount"
                value={form.peopleCount}
                onChange={handleChange}
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
                required
              >
                {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">Preferred Table (Optional)</label>
              <select 
                name="tableId"
                value={form.tableId}
                onChange={handleChange}
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
              >
                <option value="">Any Table (No Preference)</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>{t.title} - {t.floor} (Capacity: {t.seating_capacity})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 mt-4 mb-2">
              <h3 className="text-xl font-serif font-bold text-secondary border-b border-gray-100 pb-2">Your Information</h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">Full Name *</label>
              <input 
                type="text" 
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary" 
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">Phone Number *</label>
              <input 
                type="tel" 
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary" 
                required 
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-bold text-secondary uppercase tracking-wider">Special Requests / Notes</label>
              <textarea 
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Anniversary, dietary restrictions, high chair needed, etc."
                rows="3" 
                className="w-full rounded-xl p-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary"
              ></textarea>
            </div>

            <div className="md:col-span-2 mt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full h-14 min-h-0 rounded-xl text-white font-bold text-lg border-0 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
              >
                {loading ? <span className="loading loading-spinner"></span> : "Confirm Reservation"}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
