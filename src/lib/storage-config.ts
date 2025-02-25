// Storage bucket names
export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  CVS: 'cvs'
} as const;

// Default images
export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80';

// Application status type
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';

// Storage configuration
export const STORAGE_CONFIG = {
  maxProductImageSize: 5 * 1024 * 1024, // 5MB
  maxCVSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedCVTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
} as const;

// CV upload function with validation and error handling
export async function uploadCV(file: File, jobTitle: string, formData: { email: string; phone: string }) {
  try {
    // Validate file size
    if (file.size > STORAGE_CONFIG.maxCVSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Validate file type
    if (!STORAGE_CONFIG.allowedCVTypes.includes(file.type)) {
      throw new Error('Please upload a PDF, DOC, or DOCX file');
    }

    // Create safe filename
    const fileExt = file.name.split('.').pop();
    const safeJobTitle = jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const fileName = `${safeJobTitle}-${Date.now()}.${fileExt}`;

    // Get Supabase instance
    const { supabase } = await import('./supabase');

    // Upload file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.CVS)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Create application record
    const { error: applicationError } = await supabase
      .from('job_applications')
      .insert({
        job_title: jobTitle,
        cv_path: fileName,
        email: formData.email,
        phone: formData.phone,
        status: 'pending'
      });

    if (applicationError) {
      // Cleanup uploaded file if database insert fails
      await supabase.storage
        .from(STORAGE_BUCKETS.CVS)
        .remove([fileName]);
      throw applicationError;
    }

    return uploadData.path;
  } catch (error) {
    console.error('CV upload error:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to upload CV');
  }
}

// Get CV download URL (signed URL for security)
export async function getCVDownloadUrl(cvPath: string) {
  try {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.CVS)
      .createSignedUrl(cvPath, 60); // URL valid for 60 seconds

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting CV download URL:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to get CV download URL');
  }
}

// Delete CV file
export async function deleteCV(cvPath: string) {
  try {
    const { supabase } = await import('./supabase');
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.CVS)
      .remove([cvPath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to delete CV');
  }
}

// Initialize storage buckets
export async function initializeStorage() {
  try {
    const { supabase } = await import('./supabase');
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;

    const existingBuckets = new Set(buckets.map(b => b.name));

    // Create CVs bucket if it doesn't exist
    if (!existingBuckets.has(STORAGE_BUCKETS.CVS)) {
      await supabase.storage.createBucket(STORAGE_BUCKETS.CVS, {
        public: false, // Private bucket for CVs
        fileSizeLimit: STORAGE_CONFIG.maxCVSize,
        allowedMimeTypes: STORAGE_CONFIG.allowedCVTypes
      });
    }

    // Create product images bucket if it doesn't exist
    if (!existingBuckets.has(STORAGE_BUCKETS.PRODUCT_IMAGES)) {
      await supabase.storage.createBucket(STORAGE_BUCKETS.PRODUCT_IMAGES, {
        public: true,
        fileSizeLimit: STORAGE_CONFIG.maxProductImageSize,
        allowedMimeTypes: STORAGE_CONFIG.allowedImageTypes
      });
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
    // Don't throw, just log the error
  }
}