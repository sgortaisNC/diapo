import { json, type RequestHandler } from '@sveltejs/kit';
import { put } from '@vercel/blob';

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
        return json({ message: 'No file provided', ok: false }, { status: 400 });
    }
    
    try {
        // Upload vers Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
        });
        
        return json({ 
            message: 'Image uploaded', 
            ok: true,
            url: blob.url,
            filename: file.name
        });
    } catch (error) {
        console.error('Upload error:', error);
        return json({ 
            message: 'Upload failed', 
            ok: false 
        }, { status: 500 });
    }
}