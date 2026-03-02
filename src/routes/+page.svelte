<script lang="ts">
	import type { PageProps } from './$types';
	import SwiperContainer from '$lib/SwiperContainer.svelte';
	import { browser } from '$app/environment';

	type ImageItem = { name: string; url: string };

	let { data }: PageProps = $props();
	let images = $state<ImageItem[]>([]);
	const settings = $derived(data.settings);

	const durationSeconds = $derived(settings.slider_interval_seconds || 10);
	const transitionMs = 800;
	const totalCycleMs = $derived(durationSeconds * 1000);
	const autoplayDelayMs = $derived(Math.max(0, totalCycleMs - transitionMs));

	let currentIndex = $state(0);
	let progress = $state(0);
	let remainingMs = $state(0);

	let timerId: ReturnType<typeof setInterval> | null = null;
	let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

	function resetTimer() {
		remainingMs = totalCycleMs;
		progress = 0;
		if (timerId) {
			clearInterval(timerId);
		}
		timerId = setInterval(() => {
			remainingMs -= 100;
			if (remainingMs <= 0) {
				remainingMs = totalCycleMs;
			}
			const total = totalCycleMs || 1;
			progress = 1 - remainingMs / total;
		}, 100);
	}

	$effect(() => {
		const base = (data.fileList ?? []) as ImageItem[];
		// Mélange simple pour un ordre aléatoire à chaque chargement
		images = [...base].sort(() => Math.random() - 0.5);
	});

	// Restaurer la photo courante après un refresh forcé (via son URL)
	$effect(() => {
		if (!browser) return;
		// Attendre que la liste des images soit initialisée
		if (images.length === 0) return;

		const savedUrl = sessionStorage.getItem('diapo-current-url');
		if (!savedUrl) return;

		const idx = images.findIndex((img) => img.url === savedUrl);
		if (idx >= 0) {
			currentIndex = idx;
		}
		sessionStorage.removeItem('diapo-current-url');
	});

	async function refreshImages() {
		if (!browser) return;
		try {
			const response = await fetch('/api/images');
			if (!response.ok) return;
			const data = await response.json();
			if (!data?.fileList || !Array.isArray(data.fileList)) return;

			const newImages = data.fileList as ImageItem[];

			// Si le nombre d'images change (ajout ou suppression),
			// on force un refresh complet de la page,
			// en mémorisant l'URL de la photo courante.
			if (newImages.length !== images.length) {
				if (browser) {
					const currentUrl = images[currentIndex]?.url;
					if (currentUrl) {
						sessionStorage.setItem('diapo-current-url', currentUrl);
					}
					location.reload();
				}
				return;
			}

			if (currentIndex >= images.length) {
				currentIndex = Math.max(0, images.length - 1);
			}
		} catch (error) {
			console.error('Erreur lors du rafraîchissement des images :', error);
		}
	}

	$effect(() => {
		// Redémarre le timer si la durée change
		resetTimer();
		return () => {
			if (timerId) clearInterval(timerId);
			if (refreshIntervalId) clearInterval(refreshIntervalId);
		};
	});

	$effect(() => {
		if (!browser) return;

		// Premier rafraîchissement immédiat
		refreshImages();

		// Puis rafraîchissement régulier toutes les 30 secondes
		refreshIntervalId = setInterval(() => {
			refreshImages();
		}, 30000);
	});

	function handleSlideChange(event: CustomEvent<{ activeIndex: number }>) {
		currentIndex = event.detail.activeIndex ?? 0;
		resetTimer();
	}

	const remainingSeconds = $derived(Math.ceil(remainingMs / 1000));
	const currentDepositorName = $derived(images[currentIndex]?.name ?? '');
	const hasImages = $derived(images.length > 0);
</script>

<svelte:head>
	<title>{settings.event_title} - Galerie en direct</title>
</svelte:head>

<div class="relative h-screen w-full flex flex-col items-center justify-center bg-background-dark text-white font-display overflow-hidden">
	<div class="absolute inset-0 z-0">
		<SwiperContainer
			{images}
			autoplayDelay={autoplayDelayMs}
			{currentIndex}
			transitionMs={transitionMs}
			on:slideChange={handleSlideChange}
		/>
	</div>
	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" aria-hidden="true"></div>

	<div class="absolute top-0 left-0 w-full z-20 px-12 py-8 flex flex-col gap-4">
		<div class="flex items-center justify-between w-full">
			<div class="flex items-center gap-4">
				<div class="size-8 text-primary">
					<svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold tracking-[0.2em] uppercase text-white/90">
					{settings.event_title}
				</h1>
			</div>
			<div
				class="rounded-full px-6 py-2 flex items-center gap-6 border border-primary/20 backdrop-blur-xl"
				style="background: rgba(34, 30, 16, 0.6)"
			>
				<span class="material-symbols-outlined text-primary text-xl">timer</span>
				<p class="text-sm font-semibold tracking-widest text-primary/90">
					{remainingSeconds}s
				</p>
			</div>
		</div>
		<div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
			<div
				class="h-full bg-primary shadow-[0_0_10px_rgba(244,192,37,0.8)] transition-[width] duration-150 ease-linear"
				style={`width: ${Math.min(100, Math.max(0, progress * 100))}%`}
			></div>
		</div>
	</div>

	<div class="absolute bottom-0 left-0 w-full z-20 p-12 flex items-end justify-between">
		<div class="flex flex-col gap-4">
			<div
				class="p-8 rounded-xl flex flex-col gap-2 max-w-md border border-primary/20 backdrop-blur-xl"
				style="background: rgba(34, 30, 16, 0.6)"
			>
				<p class="text-primary/70 text-xs font-bold tracking-[0.3em] uppercase">
					{#if hasImages}
						{settings.hero_caption_prefix} {currentDepositorName}
					{:else}
						Galerie en direct
					{/if}
				</p>
			</div>
		</div>
		<div class="flex flex-col items-end gap-6">
			<div
				class="flex items-center gap-6 p-6 rounded-2xl shadow-2xl border border-primary/30 backdrop-blur-xl"
				style="background: rgba(34, 30, 16, 0.6)"
			>
				<div class="flex flex-col text-right gap-1">
					<h3 class="text-xl font-bold text-white">Rejoignez la galerie</h3>
					<p class="text-sm text-white/60 max-w-[220px]">
						Flashez le QR code ou allez sur
					</p>
					<a href="/dashboard" class="text-xs font-mono text-primary mt-2"
						>diapo-xi.vercel.app/dashboard</a
					>
				</div>
				<div class="bg-white p-3 rounded-lg shadow-inner">
					<a href="/dashboard" class="block size-32 bg-primary/20 rounded-lg" aria-label="QR Code to join the live event gallery"></a>
				</div>
			</div>
			<div class="flex gap-4 pr-4">
				<div class="flex items-center gap-2">
					<span class="material-symbols-outlined text-primary text-sm">photo_library</span>
					<span class="text-white/80 text-xs font-bold tracking-widest uppercase">
						{images.length} photos
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none z-10">
		<div class="absolute top-10 right-10 w-full h-full border-t-2 border-r-2 border-primary"></div>
	</div>
	<div class="absolute bottom-0 left-0 w-32 h-32 opacity-10 pointer-events-none z-10">
		<div class="absolute bottom-10 left-10 w-full h-full border-b-2 border-l-2 border-primary"></div>
	</div>
	<div
		class="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[radial-gradient(#f4c025_1px,transparent_1px)] [background-size:40px_40px]"
		aria-hidden="true"
	></div>
</div>
