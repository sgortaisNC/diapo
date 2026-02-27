import { json, type RequestHandler } from '@sveltejs/kit';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
	const host = env.BDD_HOST;
	const user = env.BDD_USERNAME;
	const password = env.BDD_PASSWORD;

	if (!host || !user || !password) {
		return json(
			{
				ok: false,
				message: 'Variables manquantes',
				details: {
					BDD_HOST: !!host,
					BDD_USERNAME: !!user,
					BDD_PASSWORD: !!password
				}
			},
			{ status: 500 }
		);
	}

	let connection: mysql.Connection | null = null;

	try {
		connection = await mysql.createConnection({
			host,
			user,
			password,
			connectTimeout: 10000
		});

		await connection.ping();

		return json({
			ok: true,
			message: 'Connexion à la base de données réussie',
			host
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Erreur inconnue';
		return json(
			{
				ok: false,
				message: 'Échec de la connexion',
				error: message
			},
			{ status: 500 }
		);
	} finally {
		if (connection) {
			await connection.end();
		}
	}
};
