import React, { useState } from 'react';
import { Upload, X, Send } from 'lucide-react';
import { uploadCV } from '../lib/storage';
import { supabase } from '../lib/supabase';

interface JobApplicationProps {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function JobApplication({ jobId, jobTitle, onClose, onSuccess }: JobApplicationProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cv, setCV] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('CV file size must be less than 5MB');
        return;
      }
      // Check file type
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
          .includes(file.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }
      setCV(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cv) {
      setError('Please upload your CV');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create application record
      const { data: application, error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          full_name: fullName,
          email,
          phone,
          cover_letter: coverLetter,
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      // Upload CV
      const cvPath = await uploadCV(cv, application.id);

      // Update application with CV path
      const { error: updateError } = await supabase
        .from('job_applications')
        .update({ cv_url: cvPath })
        .eq('id', application.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Apply for {jobTitle}</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
              CV/Resume
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-cta transition-colors duration-200">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="cv"
                    className="relative cursor-pointer rounded-md font-medium text-primary-cta hover:text-primary-cta focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-cta focus-within:ring-offset-2"
                  >
                    <span>Upload a file</span>
                    <input
                      id="cv"
                      name="cv"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF or Word up to 5MB
                </p>
                {cv && (
                  <p className="text-sm text-green-600">
                    Selected file: {cv.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-cta focus:ring focus:ring-primary-cta focus:ring-opacity-50"
              placeholder="Tell us why you're interested in this position..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-cta text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}