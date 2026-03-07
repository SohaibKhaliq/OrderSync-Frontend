import React from 'react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Food Critic",
      text: "The attention to detail and flavor combinations are absolutely incredible. A truly memorable dining experience that I would recommend to anyone.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Regular Guest",
      text: "I've been coming here for years and the quality never drops. The new menu items are fantastic, and the service is always impeccable.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Local Blogger",
      text: "Not only is the food photogenic, but it tastes even better than it looks! The atmosphere is perfect for both casual dinners and special occasions.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      id: 4,
      name: 'Ralph Edwards',
      role: 'Businessman',
      text: 'Their gluten-free dessert was a true masterpiece. This place is a hidden gem that I want to come back!',
      avatar: 'https://i.pravatar.cc/150?u=4'
    }
  ];

  return (
    <section className="bg-theme-light py-24 px-6 md:px-12 xl:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#64C2EE] font-bold tracking-widest text-xs mb-4 uppercase">Clients Testimonial</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
            What Our Guests Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center">
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full object-cover mb-4 ring-4 ring-gray-50" />
              <h3 className="font-bold text-lg text-secondary">{t.name}</h3>
              <p className="text-xs text-neutral opacity-60 mb-3">{t.role}</p>
              <div className="flex text-[#F5A623] mb-6">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <div className="mb-4">
                 <div className="w-10 h-10 rounded-full bg-[#f9f4ec] flex items-center justify-center mx-auto text-[#F5A623]">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H8v-2h3V9zm11 0h-3v-2h3v2zm-11 5H6v-2h5v2zm11 0h-5v-2h5v2zm-11 5H6v-2h5v2zm11 0h-5v-2h5v2z" /></svg>
                   {/* Actually let's use a nice quote icon */}
                   <span className="font-serif text-3xl leading-none absolute -mt-2">"</span>
                 </div>
              </div>
              <p className="text-sm text-neutral opacity-80 leading-relaxed italic">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
