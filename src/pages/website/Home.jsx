import React from 'react';

// Import refactored modular components
import HeroSection from '../../components/home/HeroSection';
import TrustBar from '../../components/home/TrustBar';
import ProjectShowcase from '../../components/home/ProjectShowcase';
import SmartFeatures from '../../components/home/SmartFeatures';
import CalculatorsSection from '../../components/home/CalculatorsSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ProjectShowcase />
      <SmartFeatures />
      <CalculatorsSection />
    </>
  );
}
