import { json, type RequestHandler } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filePath = path.join(process.cwd(), 'src/lib/assets/imgs', file.name);
    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
    return json({ message: 'Image uploaded', ok: true });
}