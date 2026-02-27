import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import {
	getEventSettings,
	updateEventSettings,
	type UpdateEventSettingsPayload
} from '$lib/server/eventSettings';

export const load: PageServerLoad = async () => {
	const settings = await getEventSettings();
	return { settings };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const event_title = (formData.get('event_title') ?? '').toString().trim();
		const event_subtitle = (formData.get('event_subtitle') ?? '').toString().trim();
		const host_names = (formData.get('host_names') ?? '').toString().trim();
		const event_description = (formData.get('event_description') ?? '').toString().trim();
		const guest_count_label = (formData.get('guest_count_label') ?? '').toString().trim();
		const hero_caption_prefix = (formData.get('hero_caption_prefix') ?? '').toString().trim();

		const slider_raw = (formData.get('slider_interval_seconds') ?? '').toString().trim();
		const slider_interval_seconds = Number.parseInt(slider_raw, 10);

		if (!event_title || !host_names) {
			return fail(400, {
				error: 'Merci de renseigner au minimum le nom de l’événement et le ou les hôtes.',
				values: {
					event_title,
					event_subtitle,
					host_names,
					event_description,
					guest_count_label,
					hero_caption_prefix,
					slider_interval_seconds: slider_raw
				}
			});
		}

		const payload: UpdateEventSettingsPayload = {
			event_title,
			event_subtitle,
			host_names,
			event_description,
			guest_count_label,
			hero_caption_prefix
		};

		if (!Number.isNaN(slider_interval_seconds) && slider_interval_seconds > 0) {
			payload.slider_interval_seconds = slider_interval_seconds;
		}

		await updateEventSettings(payload);

		// On revient sur la page pour refléter les dernières valeurs
		throw redirect(303, '/admin/settings');
	}
};

