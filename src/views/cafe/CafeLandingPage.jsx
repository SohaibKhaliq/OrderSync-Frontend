import React, { useEffect, useState } from "react";
import { Settings, MenuItems } from "../../localdb/LocalDB";
import HeroSection from "./components/HeroSection";
import MenuPreviewSection from "./components/MenuPreviewSection";
import AboutSection from "./components/AboutSection";
import PhilosophySection from "./components/PhilosophySection";
import GallerySection from "./components/GallerySection";
import TestimonialsSection from "./components/TestimonialsSection";

export default function CafeLandingPage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    setFeatured(
      MenuItems.getAll()
        .filter((m) => m.is_active)
        .slice(0, 4) // We want exactly 4 for the Menu Preview Section grid layout
    );
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <HeroSection />
      
      {featured.length > 0 && <MenuPreviewSection items={featured} />}
      
      <AboutSection />
      
      <PhilosophySection />
      
      <GallerySection />
      
      <TestimonialsSection />
    </div>
  );
}
