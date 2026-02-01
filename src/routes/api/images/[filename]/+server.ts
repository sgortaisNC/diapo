import { error, type RequestHandler } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';

export const GET: RequestHandler = async ({ params }) => {
    const { filename } = params;
    
    if (!filename) {
        throw error(400, 'Filename is required');
    }
    
    const filePath = path.join(process.cwd(), 'src/lib/assets/imgs', filename);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
        throw error(404, 'File not found');
    }
    
    // Lire le fichier
    const fileBuffer = fs.readFileSync(filePath);
    
    // Déterminer le type MIME basé sur l'extension
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    return new Response(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000'
        }
    });
};
