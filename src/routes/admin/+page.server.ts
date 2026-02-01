import { list } from '@vercel/blob';

export async function load() {
  try {
    // Lister tous les blobs depuis Vercel Blob
    const { blobs } = await list();
    
    // Extraire les noms de fichiers et URLs
    const fileList = blobs.map(blob => ({
      name: blob.pathname.split('/').pop() || blob.pathname,
      url: blob.url
    }));
    
    return { fileList };
  } catch (error) {
    console.error('Error loading blobs:', error);
    return { fileList: [] };
  }
}
