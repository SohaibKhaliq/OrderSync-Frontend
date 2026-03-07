import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MenuPreviewSection({ items = [] }) {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Breakfast', 'Dinner', 'Lunch'];

  // For visual exactly matching 4 items, we just take 4 items.
  const displayItems = items.slice(0, 4);

  return (
    <section className="bg-white py-24 px-6 md:px-12 xl:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-[#64C2EE] font-bold tracking-widest text-xs mb-4 uppercase">Discover wildly</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Our Food Menu</h2>
            <p className="text-sm text-neutral opacity-60 mt-4 max-w-sm leading-relaxed text-balance">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-4 md:mb-4">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors border ${
                  activeTab === tab
                    ? 'bg-primary border-primary text-white'
                    : 'bg-transparent border-gray-200 text-neutral hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayItems.map((item, index) => (
            <div key={item.id} className="group relative pt-4 cursor-pointer">
              {/* Product Card Container matching exact shadow and shape */}
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all p-4 border border-gray-50/50">
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-6">
                  {index === 0 && (
                     <div className="absolute top-3 left-3 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full z-10">Best Seller</div>
                  )}
                  {/* Image placeholder simulation */}
                  <img 
                    src={item.image || `https://images.unsplash.com/photo-${['1540189549336-e6e99c3679fe', '1565299624946-b28f40a0ae38', '1482049016688-2d3e1b311543', '1481070414801-51fd732d7184'][index % 4]}?q=80&w=600&auto=format&fit=crop`}
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://images.unsplash.com/photo-${['1540189549336-e6e99c3679fe', '1565299624946-b28f40a0ae38', '1482049016688-2d3e1b311543', '1481070414801-51fd732d7184'][index % 4]}?q=80&w=600&auto=format&fit=crop` }}
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <h3 className="font-serif font-bold text-xl mb-3">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-[#F5A623]">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className={`w-3 h-3 ${star === 5 ? 'text-gray-300' : 'fill-current'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-bold text-lg text-secondary">${parseFloat(item.price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/menu" className="btn bg-white hover:bg-gray-50 text-secondary border border-gray-200 rounded-full px-8 font-semibold h-12 min-h-0 shadow-sm">
            More Foods
          </Link>
        </div>
      </div>
    </section>
  );
}
