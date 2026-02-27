import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import mysql from 'mysql2/promise';

export const GET: RequestHandler = async () => {
	const host = env.BDD_HOST;
	const user = env.BDD_USERNAME;
	const password = env.BDD_PASSWORD;
	const database = env.BDD_NAME;

	if (!host || !user || !password || !database) {
		return json(
			{
				ok: false,
				message: 'Database not configured',
				fileList: []
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

		const [rows] = await connection.execute(
			'SELECT depositor_name, COALESCE(image_src, image_url) AS src FROM images WHERE validation_status != ? ORDER BY created_at DESC',
			['rejected']
		);
		await connection.end();

		const fileList = (rows as any[]).map((row) => ({
			name: row.depositor_name as string,
			url: row.src as string
		}));

		return json({
			ok: true,
			fileList
		});
	} catch (error) {
		console.error('Error loading images from /api/images:', error);
		return json(
			{
				ok: false,
				message: 'Error loading images',
				fileList: []
			},
			{ status: 500 }
		);
	}
}

