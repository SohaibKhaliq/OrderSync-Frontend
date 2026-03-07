import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-theme-light pt-12 pb-24 md:pt-20 md:pb-32 px-6 md:px-12 xl:px-24 flex items-center min-h-[85vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-[1400px] mx-auto z-10">
        
        {/* Left Content */}
        <div className="max-w-2xl">
          <p className="text-[#64C2EE] font-extrabold tracking-widest text-xs mb-6 uppercase flex items-center gap-2">
            Refresh your taste buds
          </p>
          <div className="flex gap-1.5 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block opacity-50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block opacity-25"></span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-serif font-bold text-secondary leading-[1.1] mb-8">
            Delicious Foods With <br className="hidden md:block"/>
            Wonderful {" "}
            <span className="text-[#64C2EE] relative inline-block">
              Eating
              <span className="absolute bottom-2 left-0 w-full h-1/3 bg-[#64C2EE]/20 z-[-1]"></span>
            </span>
          </h1>
          <p className="text-neutral mb-10 text-lg leading-relaxed opacity-75 max-w-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/menu" className="btn btn-secondary rounded-full px-8 font-semibold text-white hover:bg-black w-full sm:w-auto h-14 min-h-0 border-0">Menu</Link>
            <Link to="/menu" className="btn btn-primary rounded-full px-8 font-semibold text-white w-full sm:w-auto h-14 min-h-0 border-0">Book a table</Link>
          </div>
        </div>

        {/* Right Content / Image Area */}
        <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
          {/* Decorative faint background wave lines could go here using absolute SVG */}
          
          {/* Main Circular Plate */}
          <div className="relative w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full p-2 bg-white shadow-2xl flex items-center justify-center z-10 mx-auto lg:mr-0">
            {/* Concentric rings to match the theme background lines behind the plate */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-gray-100 z-[-1]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border border-gray-100 z-[-1]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] rounded-full border border-gray-100 z-[-1]"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop" 
              alt="Delicious Salmon with Greens" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
