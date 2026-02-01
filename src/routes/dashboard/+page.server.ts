import { list } from '@vercel/blob';
import { env } from '$env/dynamic/private';

export async function load() {
  try {
    const token = env.BLOB_READ_WRITE_TOKEN;
    
    // Lister tous les blobs depuis Vercel Blob
    const { blobs } = await list({ token });
    
    // Extraire les noms de fichiers et URLs
    const fileList = blobs.map(blob => ({
      name: blob.pathname.split('/').pop() || blob.pathname,
      url: blob.url
    }));
    
    return { fileList };
  } catch (error: any) {
    console.error('Error loading blobs:', error);
    return { fileList: [] };
  }
}
