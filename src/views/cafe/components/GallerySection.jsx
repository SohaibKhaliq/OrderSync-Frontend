import React from 'react';
import { Link } from 'react-router-dom';

export default function GallerySection() {
  const images = [
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80",
    "https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=600&q=80",
    "https://images.unsplash.com/photo-1484723091791-cdd51a021278?w=600&q=80",
    "https://images.unsplash.com/photo-1510398668585-64539e0bd5fd?w=600&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-12 xl:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-[#64C2EE] font-bold tracking-widest text-xs mb-4 uppercase">From Our Stores</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary max-w-xl leading-tight">
              A visual journey through<br className="hidden md:block"/> our signature dishes
            </h2>
          </div>
          <Link to="/" className="btn bg-white hover:bg-gray-50 text-secondary border border-gray-200 rounded-full px-8 font-semibold h-12 min-h-0 shadow-sm shrink-0">
            See More
          </Link>
        </div>

        {/* Masonry Layout Simulation matching the exact theme */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="col-span-1 flex flex-col gap-4 md:gap-6 mt-8 md:mt-24">
            <div className="rounded-2xl overflow-hidden shadow-sm h-48 md:h-64">
              <img src={images[0]} alt="Food gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm h-64 md:h-80 relative">
              <img src={images[1]} alt="Food gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
              {/* Fake cursor on image 1 like in the screenshot */}
              <div className="absolute top-1/2 left-1/2 pointer-events-none">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-md">
                   <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.35a.5.5 0 00-.85-.14z" fill="currentColor"/>
                 </svg>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-4 md:gap-6">
            <div className="rounded-2xl overflow-hidden shadow-sm h-[300px] md:h-[450px]">
              <img src={images[2]} alt="Food gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="rounded-2xl overflow-hidden shadow-sm h-40 md:h-60">
                <img src={images[3]} alt="Food gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm h-40 md:h-60">
                <img src={images[4]} alt="Food gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-4 md:gap-6 md:mt-12">
            <div className="rounded-2xl overflow-hidden shadow-sm h-40 md:h-48 w-3/4 self-end">
              <img src={images[5]} alt="Food gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm h-56 md:h-72">
              <img src={images[6]} alt="Food gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm h-32 md:h-40 w-5/6">
              <img src={images[0]} alt="Food gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
