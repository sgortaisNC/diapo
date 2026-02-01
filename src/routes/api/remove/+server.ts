import { json, type RequestHandler } from '@sveltejs/kit';
import { del } from '@vercel/blob';

export const DELETE: RequestHandler = async ({ request }) => {
    const { url } = await request.json();
    
    if (!url) {
        return json({ message: 'URL is required', ok: false }, { status: 400 });
    }
    
    try {
        // Supprimer depuis Vercel Blob
        await del(url);
        return json({ message: 'Image deleted', ok: true });
    } catch (error) {
        console.error('Delete error:', error);
        return json({ 
            message: 'Delete failed', 
            ok: false 
        }, { status: 500 });
    }
}