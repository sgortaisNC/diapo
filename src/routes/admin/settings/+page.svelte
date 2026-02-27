<script lang="ts">
	import type { PageProps } from './$types';
	import AdminSidebar from '$lib/AdminSidebar.svelte';
	import AdminHeader from '$lib/AdminHeader.svelte';

	let { data }: PageProps = $props();
	const settings = $derived(data.settings);
</script>

<div class="flex h-screen overflow-hidden bg-dark-bg text-gray-200 font-sans antialiased">
	<AdminSidebar totalPhotos={0} pendingCount={0} approvedCount={0} activeRoute="settings" />
	<main class="flex-1 flex flex-col overflow-hidden">
		<AdminHeader title="Paramètres de l’événement" badge="Configuration" />
		<section class="flex-1 overflow-y-auto p-8 bg-dark-bg">
			<div class="max-w-3xl mx-auto bg-dark-surface border border-dark-border rounded-xl shadow-2xl p-8 space-y-8">
				<header class="space-y-2">
					<h2 class="text-2xl font-semibold text-white">Informations générales</h2>
					<p class="text-sm text-gray-400">
						Personnalisez le nom de l’événement, les textes affichés sur l’écran d’accueil et la page
						d’upload invités.
					</p>
				</header>

				<form method="POST" class="space-y-8">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="space-y-2">
							<label for="event_title" class="text-sm font-medium text-gray-300">
								Nom de l’événement
							</label>
							<input
								id="event_title"
								name="event_title"
								type="text"
								class="w-full px-3 py-2 rounded-md bg-dark-bg border border-dark-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
								value={settings.event_title}
								required
							/>
							<p class="text-xs text-gray-500">
								Affiché dans le titre de la page d’accueil et dans l’entête.
							</p>
						</div>

						<div class="space-y-2">
							<label for="host_names" class="text-sm font-medium text-gray-300">
								Nom(s) de l’hôte / du couple
							</label>
							<input
								id="host_names"
								name="host_names"
								type="text"
								class="w-full px-3 py-2 rounded-md bg-dark-bg border border-dark-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
								value={settings.host_names}
								required
							/>
							<p class="text-xs text-gray-500">
								Utilisé sur la page d’upload invités et dans les messages d’information.
							</p>
						</div>
					</div>

					<div class="space-y-2">
						<label for="event_subtitle" class="text-sm font-medium text-gray-300">
							Sous-titre / tagline
						</label>
						<input
							id="event_subtitle"
							name="event_subtitle"
							type="text"
							class="w-full px-3 py-2 rounded-md bg-dark-bg border border-dark-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
							value={settings.event_subtitle}
						/>
						<p class="text-xs text-gray-500">
							Petite phrase d’accroche affichée sur l’écran d’accueil.
						</p>
					</div>

					<div class="space-y-2">
						<label for="event_description" class="text-sm font-medium text-gray-300">
							Texte d’introduction upload
						</label>
						<textarea
							id="event_description"
							name="event_description"
							rows="3"
							class="w-full px-3 py-2 rounded-md bg-dark-bg border border-dark-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary resize-none"
						>{settings.event_description}</textarea>
						<p class="text-xs text-gray-500">
							Affiché sur la page `/dashboard` pour expliquer aux invités comment participer.
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div class="space-y-2">
							<label for="guest_count_label" class="text-sm font-medium text-gray-300">
								Libellé des invités
							</label>
							<input
								id="guest_count_label"
								name="guest_count_label"
								type="text"
								class="w-full px-3 py-2 rounded-md bg-dark-bg border border-dark-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
								value={settings.guest_count_label}
							/>
							<p class="text-xs text-gray-500">
								Texte affiché à côté du nombre d’invités sur l’écran d’accueil.
							</p>
						</div>

						<div class="space-y-2">
							<label for="slider_interval_seconds" class="text-sm font-medium text-gray-300">
								Durée d’affichage d’une photo (s)
							</label>
							<input
								id="slider_interval_seconds"
								name="slider_interval_seconds"
								type="number"
								min="1"
								step="1"
								class="w-full px-3 py-2 rounded-md bg-dark-bg border border-dark-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
								value={settings.slider_interval_seconds}
							/>
							<p class="text-xs text-gray-500">
								Temps avant le passage automatique à la photo suivante sur l’écran d’accueil.
							</p>
						</div>

						<div class="space-y-2">
							<label for="hero_caption_prefix" class="text-sm font-medium text-gray-300">
								Texte avant le nom du dépositaire
							</label>
							<input
								id="hero_caption_prefix"
								name="hero_caption_prefix"
								type="text"
								class="w-full px-3 py-2 rounded-md bg-dark-bg border border-dark-border text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary"
								value={settings.hero_caption_prefix}
							/>
							<p class="text-xs text-gray-500">
								Par exemple «&nbsp;Photo partagée par&nbsp;» dans la légende en bas à gauche.
							</p>
						</div>
					</div>

					<div class="pt-4 flex justify-end">
						<button
							type="submit"
							class="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-gold-primary hover:bg-gold-light text-dark-bg font-semibold text-sm uppercase tracking-widest transition-colors"
						>
							<span class="material-symbols-outlined text-sm">save</span>
							Enregistrer les paramètres
						</button>
					</div>
				</form>
			</div>
		</section>
	</main>
</div>

