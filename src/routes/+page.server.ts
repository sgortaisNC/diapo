import { env } from '$env/dynamic/private';
import mysql from 'mysql2/promise';
import { getEventSettings } from '$lib/server/eventSettings';

export async function load() {
	const host = env.BDD_HOST;
	const user = env.BDD_USERNAME;
	const password = env.BDD_PASSWORD;
	const database = env.BDD_NAME;

	if (!host || !user || !password || !database) {
		const settings = await getEventSettings();
		return { fileList: [], settings };
	}

	try {
		const connection = await mysql.createConnection({
			host,
			user,
			password,
			database
		});

		// Pour l'écran principal, on affiche toutes les images non rejetées
		// On privilégie image_src (URL publique), avec fallback sur image_url
		const [rows] = await connection.execute(
			'SELECT depositor_name, COALESCE(image_src, image_url) AS src FROM images WHERE validation_status != ? ORDER BY created_at DESC',
			['rejected']
		);
		await connection.end();

		const fileList = (rows as any[]).map((row) => ({
			name: row.depositor_name as string,
			url: row.src as string
		}));

		const settings = await getEventSettings();

		return { fileList, settings };
	} catch (error) {
		console.error('Error loading images from database:', error);
		const settings = await getEventSettings();
		return { fileList: [], settings };
	}
}
