import { json, type RequestHandler } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
        return json({ message: 'No file provided', ok: false }, { status: 400 });
    }
    
    // Vérifier si le token est disponible
    const token = env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
        console.error('BLOB_READ_WRITE_TOKEN is not set');
        return json({ 
            message: 'Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.', 
            ok: false 
        }, { status: 500 });
    }
    
    try {
        // Upload vers Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
            token: token, // Spécifier explicitement le token
        });
        
        return json({ 
            message: 'Image uploaded', 
            ok: true,
            url: blob.url,
            filename: file.name
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        const errorMessage = error?.message || 'Unknown error';
        return json({ 
            message: `Upload failed: ${errorMessage}`, 
            ok: false,
            error: errorMessage
        }, { status: 500 });
    }
}