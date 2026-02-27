import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import mysql from 'mysql2/promise';

function slugifyName(name: string): string {
	return name
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File | null;
	const name = formData.get('name');

	if (!file) {
		return json({ message: 'No file provided', ok: false }, { status: 400 });
	}

	const guestName =
		typeof name === 'string' ? name.trim() : name instanceof File ? name.name.trim() : '';

	if (!guestName) {
		return json({ message: 'Name is required', ok: false }, { status: 400 });
	}

	try {
		const slug = slugifyName(guestName);

		let ftpOk = false;
		let dbOk = false;
		let ftpPath: string | null = null;

		// Upload sur le FTP, dans httpdocs/<slug>/
		const ftpHost = env.FTP_HOST;
		const ftpUser = env.FTP_USERNAME;
		const ftpPassword = env.FTP_PASSWORD;

		if (ftpHost && ftpUser && ftpPassword) {
			const client = new Client(10000);

			try {
				await client.access({
					host: ftpHost,
					user: ftpUser,
					password: ftpPassword,
					secure: false
				});

				// On se place dans httpdocs, puis on crée / utilise un sous-dossier par invité
				await client.cd('httpdocs');
				// NOTE : ensureDir() se charge aussi de faire un cd dans le dossier
				await client.ensureDir(slug);

				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				const stream = Readable.from(buffer);

				// On envoie le fichier dans le dossier courant (httpdocs/<slug>)
				await client.uploadFrom(stream, file.name);

				ftpOk = true;
				ftpPath = `httpdocs/${slug}/${file.name}`;
			} catch (error) {
				console.error('FTP upload failed:', error);
			} finally {
				try {
					client.close();
				} catch {
					// ignore
				}
			}
		} else {
			console.warn('FTP env vars are not fully set; skipping FTP upload.');
		}

		// Construction de l'URL publique de l'image à partir du FTP
		// Domaine fixe pour l'hébergement des images
		const publicBase = (env.PUBLIC_IMAGE_BASE_URL as string | undefined) ?? 'https://seb.netcomdev2.com';
		let imageSrc: string;

		if (publicBase) {
			const base = (publicBase as string).replace(/\/$/, '');
			imageSrc = `${base}/${slug}/${file.name}`;
		} else if (ftpPath) {
			// Fallback : on enregistre le chemin FTP si aucune URL HTTP n'est disponible
			imageSrc = ftpPath;
		} else {
			imageSrc = '';
		}

		// Insertion en base de données de la liaison nom -> URL de l'image
		const dbHost = env.BDD_HOST;
		const dbUser = env.BDD_USERNAME;
		const dbPassword = env.BDD_PASSWORD;
		const dbName = env.BDD_NAME;

		if (dbHost && dbUser && dbPassword && dbName) {
			try {
				const connection = await mysql.createConnection({
					host: dbHost,
					user: dbUser,
					password: dbPassword,
					database: dbName
				});

				await connection.execute(`
          CREATE TABLE IF NOT EXISTS images (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            depositor_name VARCHAR(255) NOT NULL,
            image_url VARCHAR(512) NOT NULL,
            image_src VARCHAR(512) NOT NULL,
            validation_status ENUM('pending','validated','rejected') NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

				await connection.execute(
					'INSERT INTO images (depositor_name, image_url, image_src) VALUES (?, ?, ?)',
					[guestName, ftpPath ?? '', imageSrc]
				);

				await connection.end();
				dbOk = true;
			} catch (error) {
				console.error('DB insert failed:', error);
			}
		} else if (!dbName) {
			console.warn('BDD_NAME is not set; skipping DB insert.');
		}

		return json({
			message: 'Image uploaded',
			ok: true,
			url: imageSrc,
			filename: file.name,
			ftpOk,
			dbOk,
			ftpPath,
			guestName,
			slug
		});
	} catch (error: any) {
		console.error('Upload error:', error);
		const errorMessage = error?.message || 'Unknown error';
		return json(
			{
				message: `Upload failed: ${errorMessage}`,
				ok: false,
				error: errorMessage
			},
			{ status: 500 }
		);
	}
}

