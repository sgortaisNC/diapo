import { env } from '$env/dynamic/private';
import mysql from 'mysql2/promise';

export interface EventSettings {
	id: number;
	event_title: string;
	event_subtitle: string;
	host_names: string;
	event_description: string;
	guest_count_label: string;
	slider_interval_seconds: number;
	hero_caption_prefix: string;
}

const DEFAULT_SETTINGS: Omit<EventSettings, 'id'> = {
	event_title: "Événement en direct",
	event_subtitle: "Partagez vos plus beaux souvenirs en temps réel",
	host_names: "Vos hôtes",
	event_description: "Partagez vos photos de la soirée et faites vivre la galerie en direct.",
	guest_count_label: "Invités",
	slider_interval_seconds: 10,
	hero_caption_prefix: "Photo partagée par"
};

function buildSettings(row: any | undefined | null): EventSettings {
	if (!row) {
		return {
			id: 1,
			...DEFAULT_SETTINGS
		};
	}

	return {
		id: row.id ?? 1,
		event_title: row.event_title ?? DEFAULT_SETTINGS.event_title,
		event_subtitle: row.event_subtitle ?? DEFAULT_SETTINGS.event_subtitle,
		host_names: row.host_names ?? DEFAULT_SETTINGS.host_names,
		event_description: row.event_description ?? DEFAULT_SETTINGS.event_description,
		guest_count_label: row.guest_count_label ?? DEFAULT_SETTINGS.guest_count_label,
		slider_interval_seconds:
			typeof row.slider_interval_seconds === 'number' && !Number.isNaN(row.slider_interval_seconds)
				? row.slider_interval_seconds
				: DEFAULT_SETTINGS.slider_interval_seconds,
		hero_caption_prefix: row.hero_caption_prefix ?? DEFAULT_SETTINGS.hero_caption_prefix
	};
}

async function getConnection() {
	const host = env.BDD_HOST;
	const user = env.BDD_USERNAME;
	const password = env.BDD_PASSWORD;
	const database = env.BDD_NAME;

	if (!host || !user || !password || !database) {
		throw new Error('Database not configured for event settings');
	}

	return mysql.createConnection({
		host,
		user,
		password,
		database
	});
}

export async function getEventSettings(): Promise<EventSettings> {
	try {
		const connection = await getConnection();

		await connection.execute(`
      CREATE TABLE IF NOT EXISTS event_settings (
        id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
        event_title VARCHAR(255) NOT NULL,
        event_subtitle VARCHAR(255) NOT NULL,
        host_names VARCHAR(255) NOT NULL,
        event_description VARCHAR(512) NOT NULL,
        guest_count_label VARCHAR(255) NOT NULL,
        slider_interval_seconds INT UNSIGNED NOT NULL DEFAULT 10,
        hero_caption_prefix VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

		const [rows] = await connection.execute('SELECT * FROM event_settings WHERE id = 1 LIMIT 1');
		await connection.end();

		const row = (rows as any[])[0];

		if (!row) {
			// Pas encore de ligne, on retourne simplement les valeurs par défaut.
			return buildSettings(null);
		}

		return buildSettings(row);
	} catch (error) {
		console.error('Error loading event settings:', error);
		return buildSettings(null);
	}
}

export type UpdateEventSettingsPayload = Partial<
	Pick<
		EventSettings,
		| 'event_title'
		| 'event_subtitle'
		| 'host_names'
		| 'event_description'
		| 'guest_count_label'
		| 'slider_interval_seconds'
		| 'hero_caption_prefix'
	>
>;

export async function updateEventSettings(payload: UpdateEventSettingsPayload): Promise<EventSettings> {
	const connection = await getConnection();

	await connection.execute(`
    CREATE TABLE IF NOT EXISTS event_settings (
      id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
      event_title VARCHAR(255) NOT NULL,
      event_subtitle VARCHAR(255) NOT NULL,
      host_names VARCHAR(255) NOT NULL,
      event_description VARCHAR(512) NOT NULL,
      guest_count_label VARCHAR(255) NOT NULL,
      slider_interval_seconds INT UNSIGNED NOT NULL DEFAULT 10,
      hero_caption_prefix VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

	const current = await getEventSettings();

	const merged: EventSettings = {
		...current,
		...payload,
		id: 1,
		slider_interval_seconds:
			typeof payload.slider_interval_seconds === 'number' && !Number.isNaN(payload.slider_interval_seconds)
				? Math.max(1, payload.slider_interval_seconds)
				: current.slider_interval_seconds
	};

	await connection.execute(
		`
    INSERT INTO event_settings (
      id,
      event_title,
      event_subtitle,
      host_names,
      event_description,
      guest_count_label,
      slider_interval_seconds,
      hero_caption_prefix
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      event_title = VALUES(event_title),
      event_subtitle = VALUES(event_subtitle),
      host_names = VALUES(host_names),
      event_description = VALUES(event_description),
      guest_count_label = VALUES(guest_count_label),
      slider_interval_seconds = VALUES(slider_interval_seconds),
      hero_caption_prefix = VALUES(hero_caption_prefix)
  `,
		[
			1,
			merged.event_title,
			merged.event_subtitle,
			merged.host_names,
			merged.event_description,
			merged.guest_count_label,
			merged.slider_interval_seconds,
			merged.hero_caption_prefix
		]
	);

	await connection.end();

	return merged;
}

