import React from "react";
import AboutSection from "./components/AboutSection";
import PhilosophySection from "./components/PhilosophySection";
import TestimonialsSection from "./components/TestimonialsSection";

export default function CafeAboutPage() {
  return (
    <div className="pt-24 pb-12 bg-theme-light">
      <div className="text-center mb-12 px-4">
        <h1 className="text-5xl font-serif font-bold text-secondary">About Us</h1>
        <p className="text-neutral opacity-70 mt-4 max-w-2xl mx-auto">Discover our story and what makes our food special.</p>
      </div>
      <AboutSection />
      <PhilosophySection />
      <TestimonialsSection />
    </div>
  );
}
