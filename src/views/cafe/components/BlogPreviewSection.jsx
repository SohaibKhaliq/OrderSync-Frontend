import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogPreviewSection() {
  const blogs = [
    {
      id: 1,
      date: '17 JUNE',
      title: 'New Seasonal Menu Just Dropped! Specials Revealed',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      date: '24 JUNE',
      title: "Chef's Table Exclusive: Weekend Specials Revealed",
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 3,
      date: '27 JUNE',
      title: "We're Expanding! A New Location is Coming Soon!",
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    }
  ];

  return (
    <section className="bg-theme-light py-24 px-6 md:px-12 xl:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#64C2EE] font-bold tracking-widest text-xs mb-4 uppercase">News & Blog</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
            From Our Kitchen to Your Screen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="relative rounded-2xl overflow-hidden mb-6 h-64">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg z-10 shadow-md">
                  {blog.date}
                </div>
              </div>
              <h3 className="font-serif font-bold text-2xl mb-4 text-secondary group-hover:text-primary transition-colors leading-tight">
                {blog.title}
              </h3>
              <Link to="/" className="text-sm font-semibold text-neutral border-b border-neutral hover:text-primary hover:border-primary transition-colors pb-0.5 inline-flex items-center gap-2">
                Read More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
