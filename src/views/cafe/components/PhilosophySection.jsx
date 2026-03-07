import React from 'react';
import { Link } from 'react-router-dom';

export default function PhilosophySection() {
  return (
    <section className="bg-white py-24 px-6 md:px-12 xl:px-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Text area */}
        <div className="max-w-xl mx-auto lg:mx-0">
          <p className="text-[#64C2EE] font-bold tracking-widest text-xs mb-4 uppercase">Quality & Balance</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary leading-tight mb-8">
            Our Food Philosophy
          </h2>
          <p className="text-neutral mb-10 text-lg leading-relaxed opacity-75">
            Simple and balanced. Alexander Petrov brings together flavors and specialties from Italy and beyond to create his own culinary world, full of surprising artistry.
          </p>
          
          <Link to="/" className="btn btn-primary rounded-full px-8 text-white font-semibold h-14 min-h-0 border-0 shadow-lg shadow-primary/30">
            Read More
          </Link>
        </div>

        {/* Right Side: Images Masonry */}
        <div className="relative w-full max-w-lg mx-auto lg:max-w-none h-[500px] md:h-[600px] flex items-center justify-center">
          {/* Main tall image */}
          <div className="absolute left-0 bottom-0 top-12 w-[60%] rounded-2xl overflow-hidden shadow-2xl z-10 hidden sm:block">
             <img 
               src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop" 
               alt="Chef plating food" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             />
          </div>
          {/* Main image for mobile */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl z-10 sm:hidden">
             <img 
               src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop" 
               alt="Chef plating food" 
               className="w-full h-full object-cover"
             />
          </div>
          
          {/* Right smaller image */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[60%] rounded-2xl overflow-hidden shadow-xl z-20 hidden sm:block">
             <img 
               src="https://images.unsplash.com/photo-1615719413546-198b25453f85?q=80&w=600&auto=format&fit=crop" 
               alt="Food preparation" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 border-[8px] border-white rounded-2xl z-30 pointer-events-none"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
