import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumbers: string[];
  className?: string;
}

export function WhatsAppButton({ 
  phoneNumbers = ['+256702554028', '+256784772829'], 
  className = '' 
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = (phoneNumber: string) => {
    const formattedNumber = phoneNumber.replace(/\+/g, '');
    window.open(`https://wa.me/${formattedNumber}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div 
        className={`
          absolute bottom-full right-0 mb-2 
          transition-all duration-200 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}
      >
        <div className="bg-white rounded-lg shadow-lg p-2 mb-2">
          {phoneNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handleWhatsAppClick(number)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md transition-colors duration-200 flex items-center space-x-2"
              aria-label={`Chat on WhatsApp: ${number}`}
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>{number}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
        aria-label="Open WhatsApp chat"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}