import { env } from '$env/dynamic/private';
import mysql from 'mysql2/promise';
import { getEventSettings } from '$lib/server/eventSettings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
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

		// Sur le dashboard, on affiche uniquement les images non rejetées de cet utilisateur.
		const [rows] = await connection.execute(
			'SELECT depositor_name, COALESCE(image_src, image_url) AS src FROM images WHERE validation_status != ? ORDER BY created_at DESC',
			['rejected']
		);
		await connection.end();

		const fileList = (rows as any[]).map((row) => ({
			name: row.depositor_name as string,
			url: row.src as string
		}));

		console.log(fileList);

		const settings = await getEventSettings();

		return { fileList, settings };
	} catch (error) {
		console.error('Error loading images from database (dashboard):', error);
		const settings = await getEventSettings();
		return { fileList: [], settings };
	}
};
