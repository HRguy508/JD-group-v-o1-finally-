import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import { uploadCV } from '../lib/storage';
import { submitJobApplication } from '../lib/supabase';
import { Toast } from './Toast';
import { validatePhoneNumber } from '../lib/utils';

interface JobApplicationModalProps {
  isOpen: boolean;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'personal' | 'resume' | 'questions' | 'review';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  experience: string;
  coverLetter: string;
  cv: File | null;
}

export function JobApplicationModal({ isOpen, jobTitle, onClose, onSuccess }: JobApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    experience: '',
    coverLetter: '',
    cv: null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const steps: { id: Step; title: string; description: string }[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself'
    },
    {
      id: 'resume',
      title: 'Resume/CV',
      description: 'Upload your CV and cover letter'
    },
    {
      id: 'questions',
      title: 'Additional Questions',
      description: 'Help us understand your experience'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your application before submitting'
    }
  ];

  const validateStep = (step: Step): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (step) {
      case 'personal':
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!validatePhoneNumber(formData.phone)) {
          newErrors.phone = 'Please enter a valid Uganda phone number';
        }
        break;

      case 'resume':
        if (!formData.cv) {
          newErrors.cv = 'Please upload your CV';
        }
        if (!formData.coverLetter.trim()) {
          newErrors.coverLetter = 'Cover letter is required';
        }
        break;

      case 'questions':
        if (!formData.experience.trim()) {
          newErrors.experience = 'Please describe your relevant experience';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (validateStep(currentStep) && currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, cv: 'File size must be less than 10MB' });
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, cv: 'Please upload a PDF or Word document' });
        return;
      }

      setFormData({ ...formData, cv: file });
      setErrors({ ...errors, cv: undefined });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setIsSubmitting(true);
      setErrors({});

      if (!formData.cv) {
        throw new Error('Please upload your CV');
      }

      // Upload CV first
      const cvPath = await uploadCV(formData.cv, jobTitle);

      // Submit application
      await submitJobApplication({
        job_title: jobTitle,
        email: formData.email,
        phone: formData.phone,
        cv_path: cvPath,
        cover_letter: formData.coverLetter
      });

      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Application submission error:', error);
      setToast({
        message: error instanceof Error ? error.message : 'Failed to submit application',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('personal');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      experience: '',
      coverLetter: '',
      cv: null
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent ${
                  errors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+256 or 07XX XXXXXX"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent"
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your CV (PDF or Word) <span className="text-red-500">*</span>
              </label>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 transition-colors duration-200 cursor-pointer
                  ${formData.cv ? 'border-primary-cta bg-primary-cta bg-opacity-5' : 'border-gray-300'}
                  ${errors.cv ? 'border-red-300 bg-red-50' : ''}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {formData.cv ? (
                    <>
                      <FileText className="h-8 w-8 text-primary-cta mb-2" />
                      <span className="text-sm text-primary-cta font-medium">{formData.cv.name}</span>
                      <span className="text-xs text-gray-500 mt-1">Click to change file</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to select your CV</span>
                      <span className="text-xs text-gray-400 mt-1">PDF or Word (max 10MB)</span>
                    </>
                  )}
                </div>
              </div>
              {errors.cv && (
                <p className="mt-1 text-sm text-red-600">{errors.cv}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent ${
                  errors.coverLetter ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us why you're interested in this position..."
              />
              {errors.coverLetter && (
                <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
              )}
            </div>
          </div>
        );

      case 'questions':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relevant Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cta focus:border-transparent ${
                  errors.experience ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your relevant experience for this position..."
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Full Name:</dt>
                  <dd className="text-sm font-medium">{formData.fullName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Email:</dt>
                  <dd className="text-sm font-medium">{formData.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Phone:</dt>
                  <dd className="text-sm font-medium">{formData.phone}</dd>
                </div>
                {formData.linkedin && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">LinkedIn:</dt>
                    <dd className="text-sm font-medium">{formData.linkedin}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Resume & Cover Letter</h4>
              <dl className="space-y-2">
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-600">CV:</dt>
                  <dd className="text-sm font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-primary-cta" />
                    {formData.cv?.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">Cover Letter:</dt>
                  <dd className="text-sm bg-white p-3 rounded border border-gray-200">
                    {formData.coverLetter}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
              <p className="text-sm bg-white p-3 rounded border border-gray-200">
                {formData.experience}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl relative">
        <div className="p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Apply for {jobTitle}</h2>
            <p className="text-sm text-gray-600 mt-1">Complete all required fields to submit your application</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      currentStep === step.id
                        ? 'border-primary-cta bg-primary-cta text-white'
                        : steps.findIndex(s => s.id === currentStep) > index
                        ? 'border-primary-cta bg-primary-cta text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {steps.findIndex(s => s.id === currentStep) > index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        steps.findIndex(s => s.id === currentStep) > index
                          ? 'bg-primary-cta'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                {steps.find(s => s.id === currentStep)?.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {steps.find(s => s.id === currentStep)?.description}
              </p>
            </div>
          </div>

          <div className="mb-6">
            {renderStepContent()}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 'personal'}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                currentStep === 'personal'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            
            {currentStep === 'review' ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-primary-cta text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-primary-cta text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200"
              >
                Next Step
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>

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