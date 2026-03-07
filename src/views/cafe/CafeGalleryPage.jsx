import React from "react";
import GallerySection from "./components/GallerySection";

export default function CafeGalleryPage() {
  return (
    <div className="pt-24 pb-12 bg-theme-light">
      <div className="text-center mb-8 px-4">
        <h1 className="text-5xl font-serif font-bold text-secondary">Our Gallery</h1>
        <p className="text-neutral opacity-70 mt-4 max-w-2xl mx-auto">A visual journey through our culinary creations and atmosphere.</p>
      </div>
      <GallerySection />
    </div>
  );
}
