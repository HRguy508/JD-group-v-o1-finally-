import { supabase } from './supabase';
import { STORAGE_BUCKETS } from './storage-config';

// CV upload function with validation
export async function uploadCV(file: File, jobId: string) {
  try {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a PDF, DOC, or DOCX file');
    }

    // Create safe filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${jobId}-${Date.now()}.${fileExt}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.CVS)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
}

// Get CV download URL
export async function getCVDownloadUrl(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.CVS)
      .createSignedUrl(path, 60); // URL valid for 60 seconds

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting CV download URL:', error);
    throw error;
  }
}

// Delete CV file
export async function deleteCV(path: string) {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.CVS)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
}