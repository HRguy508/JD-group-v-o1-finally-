import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, Check } from 'lucide-react';
import { uploadCV } from '../lib/storage';
import { submitJobApplication } from '../lib/supabase';
import { validatePhoneNumber, validateEmail } from '../lib/utils';

interface JobApplicationFormProps {
  jobTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function JobApplicationForm({ jobTitle, onSuccess, onCancel }: JobApplicationFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError('File size must be less than 10MB');
      setFile(null);
      return;
    }

    // Validate file type (PDF only)
    if (selectedFile.type !== 'application/pdf') {
      setFileError('Please upload a PDF file containing all required documents');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileError(null);
  };

  const validateForm = (): boolean => {
    // Reset errors
    setError(null);
    setFileError(null);

    // Validate required fields
    if (!fullName.trim()) {
      setError('Full name is required');
      return false;
    }

    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!phone.trim()) {
      setError('Phone number is required');
      return false;
    }

    if (!validatePhoneNumber(phone)) {
      setError('Please enter a valid Uganda phone number');
      return false;
    }

    if (!file) {
      setFileError('Please upload your CV and required documents');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Upload CV file
      const cvPath = await uploadCV(file!, jobTitle);

      // Submit application
      await submitJobApplication({
        job_title: jobTitle,
        email,
        phone,
        cv_path: cvPath,
        cover_letter: coverLetter
      });

      onSuccess();
    } catch (err) {
      console.error('Application submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary-text">Apply for {jobTitle}</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please complete all required fields and upload your documents as a single PDF file
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent"
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent"
            placeholder="you@example.com"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent"
            placeholder="+256 or 07XX XXXXXX"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent"
            placeholder="Tell us why you're interested in this position..."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CV & Documents <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-200 cursor-pointer
                ${file ? 'border-primary-cta bg-primary-cta/5' : 'border-gray-300 hover:border-gray-400'}
                ${fileError ? 'border-red-300 bg-red-50' : ''}
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <div className="flex flex-col items-center justify-center">
                {file ? (
                  <>
                    <FileText className="h-10 w-10 text-primary-cta mb-2" />
                    <p className="text-sm font-medium text-primary-cta">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Upload your CV and documents</p>
                    <p className="text-xs text-gray-500 mt-1">PDF only, max 10MB</p>
                  </>
                )}
              </div>
            </div>
            {fileError && (
              <p className="mt-1 text-sm text-red-600">{fileError}</p>
            )}
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              <strong>Important:</strong> Please combine all required documents (CV, academic certificates, 
              National ID copy, and cover letter) into a single PDF file.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-cta text-white rounded-lg hover:bg-primary-cta/90 transition-colors duration-200 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}