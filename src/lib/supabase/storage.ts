import { supabase } from './client';
import { FILE_CONFIG } from '../constants';
import { isValidFileType, isValidFileSize, generateUniqueFileName } from '../utils';

export async function uploadProductImage(file: File) {
  if (!isValidFileType(file, FILE_CONFIG.allowedTypes.images)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
  }

  if (!isValidFileSize(file, FILE_CONFIG.maxSizes.productImage)) {
    throw new Error('File size must be less than 5MB');
  }

  const fileName = generateUniqueFileName(file.name);

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data.path;
}

export async function uploadCV(file: File, jobTitle: string) {
  if (!isValidFileType(file, FILE_CONFIG.allowedTypes.documents)) {
    throw new Error('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
  }

  if (!isValidFileSize(file, FILE_CONFIG.maxSizes.cv)) {
    throw new Error('File size must be less than 10MB');
  }

  const safeJobTitle = jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const fileName = `${safeJobTitle}-${generateUniqueFileName(file.name)}`;

  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data.path;
}

export async function getFileUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

export async function getCVDownloadUrl(path: string) {
  const { data, error } = await supabase.storage
    .from('cvs')
    .createSignedUrl(path, 60); // URL valid for 60 seconds

  if (error) throw error;
  return data.signedUrl;
}