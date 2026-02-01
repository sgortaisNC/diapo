import { json, type RequestHandler } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderPath = path.join(process.cwd(), 'src/lib/assets/imgs');
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const filePath = path.join(folderPath, file.name);
    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
    return json({ message: 'Image uploaded', ok: true });
}