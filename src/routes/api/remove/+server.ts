import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import mysql from 'mysql2/promise';

export const DELETE: RequestHandler = async ({ request }) => {
	const { url } = await request.json();

	if (!url) {
		return json({ message: 'URL is required', ok: false }, { status: 400 });
	}

	const host = env.BDD_HOST;
	const user = env.BDD_USERNAME;
	const password = env.BDD_PASSWORD;
	const database = env.BDD_NAME;

	if (!host || !user || !password || !database) {
		return json(
			{
				message: 'Database not configured',
				ok: false
			},
			{ status: 500 }
		);
	}

	try {
		const connection = await mysql.createConnection({
			host,
			user,
			password,
			database
		});

		// On supprime en se basant sur l'URL publique (image_src) avec fallback sur image_url
		await connection.execute('DELETE FROM images WHERE image_src = ? OR image_url = ?', [url, url]);
		await connection.end();

		// Remarque : le fichier reste sur le FTP.
		// On pourra ajouter une suppression FTP plus tard si nécessaire.

		return json({ message: 'Image deleted from database', ok: true });
	} catch (error: any) {
		console.error('Delete error:', error);
		return json(
			{
				message: `Delete failed: ${error?.message || 'Unknown error'}`,
				ok: false
			},
			{ status: 500 }
		);
	}
}