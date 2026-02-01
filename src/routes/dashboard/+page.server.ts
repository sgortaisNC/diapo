import fs from 'node:fs';
import path from 'node:path';

export async function load() {
  const folderPath = path.join(process.cwd(), 'src/lib/assets/imgs');
  
  // Vérifier si le répertoire existe, sinon retourner une liste vide
  if (!fs.existsSync(folderPath)) {
    return { fileList: [] };
  }
  
  const files = fs.readdirSync(folderPath, { withFileTypes: true });
  
  const fileList = files
    .filter(file => file.isFile())
    .map(file => file.name);
  
  return { fileList };
}
