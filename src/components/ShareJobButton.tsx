import React, { useState, useEffect, useRef } from 'react';
import { Share2, Link as LinkIcon } from 'lucide-react';
import { Toast } from './Toast';

interface ShareJobButtonProps {
  jobTitle: string;
  jobId: string;
}

export function ShareJobButton({ jobTitle, jobId }: ShareJobButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    setActiveItem(null);
  };

  // Check if position is filled
  const isPositionFilled = (title: string) => {
    const filledPositions = [
      "Chief Executive Officer (CEO)",
      "Chief Financial Officer (CFO)",
      "Chief Operations Officer (COO)",
      "Human Resources Manager",
      "Web Developer"
    ];
    return filledPositions.includes(title);
  };

  // Don't render anything if the position is filled
  if (isPositionFilled(jobTitle)) {
    return null;
  }

  const jobUrl = `${window.location.origin}/careers/${jobId}`;
  const encodedUrl = encodeURIComponent(jobUrl);
  const encodedTitle = encodeURIComponent(`Exciting Job Opportunity at JD GROUP Uganda: ${jobTitle}`);
  const encodedDescription = encodeURIComponent('Check out this exciting career opportunity at JD GROUP Uganda!');

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%0A%0A${encodedDescription}%0A%0A${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  };

  const handleShare = async (platform: keyof typeof shareLinks) => {
    try {
      setActiveItem(platform);
      const width = 550;
      const height = 400;
      const left = Math.max(0, (window.innerWidth - width) / 2);
      const top = Math.max(0, (window.innerHeight - height) / 2);
      
      const popup = window.open(
        shareLinks[platform],
        'share',
        `width=${width},height=${height},left=${left},top=${top},location=no,menubar=no,toolbar=no,status=no,scrollbars=yes`
      );

      if (popup) {
        setTimeout(() => {
          closeMenu();
          setToast({
            message: 'Opening share dialog...',
            type: 'success'
          });
        }, 150);

        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer);
            setToast(null);
          }
        }, 1000);
      } else {
        throw new Error('Popup was blocked');
      }
    } catch (error) {
      setActiveItem(null);
      setToast({
        message: 'Failed to open share dialog. Please check your popup blocker.',
        type: 'error'
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      setActiveItem('copy');
      await navigator.clipboard.writeText(jobUrl);
      
      setTimeout(() => {
        closeMenu();
        setToast({
          message: 'Link copied to clipboard!',
          type: 'success'
        });
      }, 150);
    } catch (err) {
      setActiveItem(null);
      setToast({
        message: 'Failed to copy link. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 
          bg-white border border-gray-200 rounded-full 
          hover:bg-gray-50 hover:border-gray-300 
          active:scale-95
          transition-all duration-200 ease-in-out
          w-full sm:w-auto group
          ${isOpen ? 'bg-gray-50 border-gray-300' : ''}
        `}
        aria-label="Share job"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Share2 className={`
          h-5 w-5 text-gray-600
          transition-transform duration-200
          ${isOpen ? 'rotate-90 scale-110' : 'group-hover:rotate-12'}
        `} />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMenu}
          />
          <div 
            ref={menuRef}
            className="relative bg-white rounded-xl shadow-xl w-[280px] p-2 transform transition-all duration-200 animate-in fade-in zoom-in-95"
            role="dialog"
            aria-modal="true"
            aria-label="Share options"
          >
            <div className="text-center py-2 px-4 mb-2">
              <h3 className="text-sm font-medium text-gray-700">Share this position</h3>
            </div>
            <div className="space-y-1">
              {Object.entries(shareLinks).map(([platform, url]) => (
                <button
                  key={platform}
                  onClick={() => handleShare(platform as keyof typeof shareLinks)}
                  className={`
                    flex items-center w-full gap-3 px-4 py-2.5
                    hover:bg-gray-50 rounded-lg
                    transition-all duration-150
                    ${activeItem === platform ? 'bg-gray-50 scale-98' : ''}
                  `}
                  role="menuitem"
                >
                  {platform === 'whatsapp' && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#25D366">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                  )}
                  {platform === 'linkedin' && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#0A66C2">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                  {platform === 'facebook' && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  {platform === 'twitter' && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1DA1F2">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  <span className="capitalize text-sm">{platform}</span>
                </button>
              ))}
              <div className="h-px bg-gray-200 my-1" />
              <button
                onClick={handleCopyLink}
                className={`
                  flex items-center w-full gap-3 px-4 py-2.5
                  hover:bg-gray-50 rounded-lg
                  transition-all duration-150
                  ${activeItem === 'copy' ? 'bg-gray-50 scale-98' : ''}
                `}
                role="menuitem"
              >
                <LinkIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm">Copy link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}