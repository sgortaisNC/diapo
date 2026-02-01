import fs from 'node:fs';
import path from 'node:path';

export async function load() {
  const folderPath = path.join(process.cwd(), 'src/lib/assets/imgs');
  
  const files = fs.readdirSync(folderPath, { withFileTypes: true });
  
  const fileList = files
    .filter(file => file.isFile())
    .map(file => file.name);
  
  return { fileList };
}
