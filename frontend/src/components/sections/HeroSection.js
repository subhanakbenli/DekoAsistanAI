import React, { useState } from 'react';
import Button from '../common/Button';
import FeatureCard from '../common/FeatureCard';
import Navbar from '../Navbar';
import { featuresData } from '../../data/featuresData';
import { scrollToElement } from '../../utils/scrollUtils';

const HeroSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const handleGetStarted = () => {
    scrollToElement('demo');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent mb-6">
            DekoAsistan.AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Yapay zeka destekli iç mekan tasarımı. Odanızı hayal edin, biz gerçeğe dönüştürelim.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button onClick={handleGetStarted}>
            Hayal Et! 🚀
          </Button>
          <Button variant="secondary">
            Nasıl Çalışır?
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              isActive={activeFeature === index}
              onMouseEnter={() => setActiveFeature(index)}
            />
          ))}
        </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
