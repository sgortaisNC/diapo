import { json, type RequestHandler } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';

export const DELETE: RequestHandler = async ({ request }) => {
    const { file } = await request.json();
    const filePath = path.join(process.cwd(), 'src/lib/assets/imgs', file);
    
    // Vérifier si le fichier existe avant de le supprimer
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return json({ message: 'Image deleted', ok: true });
    }
    
    return json({ message: 'File not found', ok: false }, { status: 404 });
}