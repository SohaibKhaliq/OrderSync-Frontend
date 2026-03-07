import React from 'react';

export default function NewsletterSection() {
  return (
    <section className="bg-theme-light pb-24 px-6 md:px-12 xl:px-24">
      <div className="max-w-[1200px] mx-auto relative rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop" 
            alt="Newsletter background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-stretch min-h-[400px]">
           {/* Left Image Space - matching the theme where left half is mostly an image cutout */}
           <div className="col-span-1 lg:col-span-2 hidden md:block w-full h-full relative border-r-4 border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop" 
                alt="Chef dish" 
                className="absolute inset-0 w-full h-full object-cover rounded-l-3xl"
              />
           </div>

           {/* Newsletter Form */}
           <div className="col-span-1 lg:col-span-3 p-12 lg:p-16 flex flex-col justify-center bg-primary text-white">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
               Subscribe to Our <br className="hidden md:block"/>Newsletter
             </h2>
             <p className="text-white/80 max-w-md mb-10 leading-relaxed">
               It is a long established fact that a reader will be distracted by the readable content.
             </p>
             
             <form className="relative max-w-md" onSubmit={(e) => e.preventDefault()}>
               <div className="relative h-14 w-full">
                  <input 
                    type="email" 
                    placeholder="Enter Your Email" 
                    className="w-full h-full rounded-full pl-6 pr-16 bg-white/20 border border-white/40 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:border-white focus:bg-white/30 transition-all font-medium"
                    required
                  />
                  <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full flex items-center justify-center text-primary shadow-lg hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
               </div>
             </form>
           </div>
        </div>
      </div>
    </section>
  );
}
