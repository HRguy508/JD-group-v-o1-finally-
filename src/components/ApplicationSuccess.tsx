import { CheckCircle, Mail } from 'lucide-react';

interface ApplicationSuccessProps {
  jobTitle: string;
  onClose: () => void;
}

export function ApplicationSuccess({ jobTitle, onClose }: ApplicationSuccessProps) {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
      
      <p className="text-gray-600 mb-6">
        Thank you for applying to the <span className="font-medium">{jobTitle}</span> position at JD GROUP Uganda.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-left">
            <p className="text-sm text-blue-800 font-medium">What happens next?</p>
            <p className="text-sm text-blue-700 mt-1">
              We'll review your application and get back to you via email within 5-7 business days.
              Please check your inbox (including spam folder) for updates.
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="px-6 py-2 bg-primary-cta text-white rounded-full hover:bg-primary-cta/90 transition-colors duration-200"
      >
        Close
      </button>
    </div>
  );
}