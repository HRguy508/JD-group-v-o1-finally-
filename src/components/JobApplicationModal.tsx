import { useState } from 'react';
import { X } from 'lucide-react';
import { JobApplicationForm } from './JobApplicationForm';
import { ApplicationSuccess } from './ApplicationSuccess';

interface JobApplicationModalProps {
  isOpen: boolean;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function JobApplicationModal({ isOpen, jobTitle, onClose, onSuccess }: JobApplicationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
    // Delay the onSuccess callback to allow the user to see the success message
    setTimeout(() => {
      onSuccess();
      // Reset the submitted state after the modal is closed
      setTimeout(() => setIsSubmitted(false), 300);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6">
          {isSubmitted ? (
            <ApplicationSuccess jobTitle={jobTitle} onClose={onClose} />
          ) : (
            <JobApplicationForm 
              jobTitle={jobTitle} 
              onSuccess={handleSuccess} 
              onCancel={onClose} 
            />
          )}
        </div>
      </div>
    </div>
  );
}