import { json, type RequestHandler } from '@sveltejs/kit';
import { del } from '@vercel/blob';
import { env } from '$env/dynamic/private';

export const DELETE: RequestHandler = async ({ request }) => {
    const { url } = await request.json();
    
    if (!url) {
        return json({ message: 'URL is required', ok: false }, { status: 400 });
    }
    
    const token = env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
        return json({ 
            message: 'Blob storage not configured', 
            ok: false 
        }, { status: 500 });
    }
    
    try {
        // Supprimer depuis Vercel Blob
        await del(url, { token });
        return json({ message: 'Image deleted', ok: true });
    } catch (error: any) {
        console.error('Delete error:', error);
        return json({ 
            message: `Delete failed: ${error?.message || 'Unknown error'}`, 
            ok: false 
        }, { status: 500 });
    }
}