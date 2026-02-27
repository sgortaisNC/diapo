import { json, type RequestHandler } from '@sveltejs/kit';
import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
	const host = env.FTP_HOST;
	const user = env.FTP_USERNAME;
	const password = env.FTP_PASSWORD;

	if (!host || !user || !password) {
		return json(
			{
				ok: false,
				message: 'Variables FTP manquantes',
				details: {
					FTP_HOST: !!host,
					FTP_USERNAME: !!user,
					FTP_PASSWORD: !!password
				}
			},
			{ status: 500 }
		);
	}

	const client = new Client(10000);

	try {
		await client.access({
			host,
			user,
			password,
			secure: false
		});

		await client.cd('httpdocs');

		const content = 'Fichier de test déposé depuis l\'app diapo.\n';
		const stream = Readable.from(Buffer.from(content, 'utf-8'));

		await client.uploadFrom(stream, 'test.txt');

		return json({
			ok: true,
			message: 'Fichier test.txt déposé sur le FTP avec succès',
			path: 'httpdocs/test.txt'
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Erreur inconnue';
		return json(
			{
				ok: false,
				message: 'Échec du dépôt FTP',
				error: message
			},
			{ status: 500 }
		);
	} finally {
		client.close();
	}
};
