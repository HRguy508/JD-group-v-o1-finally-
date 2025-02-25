import React, { useState } from 'react';
import { X, Store, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnnouncementBannerProps {
  className?: string;
}

export function AnnouncementBanner({ className }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('banner_dismissed', new Date().toISOString());
  };

  const scrollToLocations = () => {
    const locationsSection = document.getElementById('locations');
    if (locationsSection) {
      locationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative z-[60] bg-gradient-to-r from-secondary-corporate to-secondary-corporate/90 text-white overflow-hidden',
        className
      )}
    >
      <div className="max-w-full">
        <div className="py-2.5 relative">
          <div className="flex items-center justify-center px-4 overflow-hidden">
            <div className="whitespace-nowrap animate-marquee">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Store className="h-5 w-5 text-highlight mr-2.5 flex-shrink-0" />
                  <span className="font-medium text-sm tracking-tight">
                    Visit our new Kampala flagship store opening March 24th, 2025 at New Pioneer Mall. Download our mobile app - coming soon!
                  </span>
                </div>
                <button
                  onClick={scrollToLocations}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full 
                           bg-white/20 hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full 
                     hover:bg-white/20 transition-colors duration-200"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}