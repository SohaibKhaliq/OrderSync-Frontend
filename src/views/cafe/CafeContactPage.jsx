import React from "react";

export default function CafeContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="pt-24 pb-24 bg-theme-light flex-1 flex flex-col items-center">
      <div className="w-full max-w-5xl px-6 md:px-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-secondary mb-4">Contact Us</h1>
          <p className="text-neutral opacity-70">We'd love to hear from you. Send us a message or visit us!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-primary/10">
          <div className="flex-1 space-y-8">
            <div>
              <h3 className="text-3xl font-serif font-bold text-secondary mb-2">Get in Touch</h3>
              <p className="text-neutral opacity-70 text-sm font-medium">Fill out the form and our team will get back to you soon.</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input type="text" placeholder="Your Name" className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary" required />
              <input type="email" placeholder="Your Email" className="w-full h-14 rounded-xl px-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary" required />
              <textarea placeholder="Your Message" rows="5" className="w-full rounded-xl p-5 bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20 text-secondary" required></textarea>
              <button type="submit" className="btn btn-primary w-full h-14 min-h-0 rounded-xl text-white font-bold text-lg border-0 shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform">Send Message</button>
            </form>
          </div>
          
          <div className="flex-1 overflow-hidden rounded-2xl relative shadow-inner min-h-[300px]">
            {/* Map image or embedded map representation */}
            <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" alt="Location Map" className="w-full h-full object-cover grayscale opacity-90" />
            </div>
            <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
            
            <div className="relative z-10 w-full h-full p-8 md:p-10 flex flex-col justify-center gap-8 text-white">
              <div>
                <h4 className="text-xs font-bold tracking-widest text-white/60 mb-2 uppercase">Address</h4>
                <p className="text-lg font-serif">329 Queensberry Street,<br/>North Melbourne VIC 3051,<br/>Australia.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-widest text-white/60 mb-2 uppercase">Contact Info</h4>
                <p className="text-xl font-medium">+1 800 555 123</p>
                <p className="text-lg opacity-90">hello@dining.com</p>
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-widest text-white/60 mb-2 uppercase">Open Hours</h4>
                <p className="text-lg opacity-90">Mon - Sun: 12PM - 10PM</p>
                <p className="text-lg opacity-90">Weekends: 4PM - 11PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
