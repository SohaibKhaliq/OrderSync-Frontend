import React, { useEffect, useState } from "react";
import { getQRMenuInit } from "../../controllers/qrmenu.controller";
import HeroSection from "./components/HeroSection";
import MenuPreviewSection from "./components/MenuPreviewSection";
import AboutSection from "./components/AboutSection";
import PhilosophySection from "./components/PhilosophySection";
import GallerySection from "./components/GallerySection";
import TestimonialsSection from "./components/TestimonialsSection";

export default function CafeLandingPage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getQRMenuInit("default").then((res) => {
        if(res.status === 200) {
           setFeatured(
             res.data.menuItems
               .filter((m) => m.is_active)
               .slice(0, 4)
           );
        }
    }).catch(console.error);
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
