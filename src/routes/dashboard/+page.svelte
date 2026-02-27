<script lang="ts">
import type { PageProps } from './$types';
import { onMount } from 'svelte';
import { browser } from '$app/environment';

	type FileItem = { name: string; url: string };

let { data }: PageProps = $props();
const settings = $derived(data.settings);

	let fileList = $state<FileItem[]>([]);
	let uploadProgress = $state<number | null>(null);
let guestName = $state<string>('');

$effect(() => {
	if (!browser) return;
	localStorage.setItem('guestName', guestName);
});

	onMount(() => {
		const serverList = data.fileList ?? [];
		if (browser) {
		const storedName = localStorage.getItem('guestName');
		if (storedName) {
			guestName = storedName;
		}
			const stored = localStorage.getItem('fileList');
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					const merged = (parsed as (string | FileItem)[]).map((item: string | FileItem) =>
						typeof item === 'string' ? { name: item, url: '' } : item
					);
					const serverUrls = new Set(serverList.map((f: FileItem) => f.url));
					fileList = merged.filter((f: FileItem) => serverUrls.has(f.url));
					localStorage.setItem('fileList', JSON.stringify(fileList));
				} catch {
					fileList = serverList;
				}
			} else {
				fileList = serverList;
			}
		} else {
			fileList = serverList;
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		uploadProgress = 0;
		const response = await fetch('/api/upload', { method: 'POST', body: formData });
		const result = await response.json();
		uploadProgress = null;
		if (result.ok && result.url) {
			fileList = [...fileList, { name: result.filename, url: result.url }];
			if (browser) localStorage.setItem('fileList', JSON.stringify(fileList));
		}
		form.reset();
	}

	async function deleteImage(file: FileItem) {
		const response = await fetch(`/api/remove`, {
			method: 'DELETE',
			body: JSON.stringify({ url: file.url })
		});
		const removed: { ok: boolean } = await response.json();
		if (removed.ok) {
			fileList = fileList.filter((f: FileItem) => f.url !== file.url);
			if (browser) localStorage.setItem('fileList', JSON.stringify(fileList));
		}
	}
</script>

<svelte:head>
	<title>{settings.host_names} - Partagez vos souvenirs</title>
</svelte:head>

<div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen selection:bg-primary/30 font-display">
	<header
		class="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md"
	>
		<div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<span class="material-symbols-outlined text-primary text-2xl">celebration</span>
				<h2 class="text-lg font-bold tracking-tight uppercase">{settings.host_names}</h2>
			</div>
			<a href="/" class="p-2 hover:bg-primary/10 rounded-lg transition-colors">
				<span class="material-symbols-outlined text-white">menu</span>
			</a>
		</div>
	</header>

	<main class="max-w-5xl mx-auto px-6 pt-12 pb-32">
		<section class="text-center mb-12">
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
				{settings.event_title}
			</h1>
			<p class="text-slate-400 text-lg max-w-xl mx-auto">
				{settings.event_description}
			</p>
		</section>

		{#if uploadProgress !== null}
			<div class="mb-12 bg-primary/5 border border-primary/20 rounded-xl p-6">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-3">
						<span class="material-symbols-outlined text-primary animate-pulse">cloud_upload</span>
						<span class="font-medium text-sm tracking-wide uppercase">Envoi de votre souvenir...</span>
					</div>
					<span class="text-primary font-bold text-sm">{uploadProgress ?? 0}%</span>
				</div>
				<div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
					<div
						class="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(244,192,37,0.5)] transition-all duration-500"
						style="width: {uploadProgress ?? 0}%"
					></div>
				</div>
			</div>
		{/if}

		<section>
			<div class="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
				<h3 class="text-xl font-semibold flex items-center gap-2">
					<span class="material-symbols-outlined text-primary">auto_awesome</span>
					Derniers moments partagés
				</h3>
				<span class="text-xs uppercase tracking-widest text-slate-500 font-bold">Live Feed</span>
			</div>
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
				{#each fileList as file (file.url)}
					<div
						class="relative group aspect-square overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300"
					>
						<img
							alt={file.name}
							class="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500"
							src={file.url}
						/>
						<div
							class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<button
								type="button"
								class="text-[10px] uppercase tracking-tighter text-primary font-bold"
								onclick={() => deleteImage(file)}
							>
								Supprimer
							</button>
						</div>
					</div>
				{/each}
				<div
					class="aspect-square rounded-lg bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-2"
				>
					<span class="material-symbols-outlined text-white/20 animate-pulse text-4xl">image</span>
					<span class="text-[10px] uppercase text-white/20 tracking-widest">En attente...</span>
				</div>
			</div>
		</section>
	</main>

	<footer
		class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-50"
	>
		<div class="max-w-md mx-auto flex flex-col items-center gap-4">
			<form action="" method="post" enctype="multipart/form-data" onsubmit={handleSubmit} class="w-full">
				<input
					type="text"
					name="name"
					bind:value={guestName}
					placeholder="Votre nom et prénom"
					class="mb-3 w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
					required
				/>
				<label
					class="w-full h-16 bg-primary text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(244,192,37,0.3)] hover:translate-y-[-2px] active:scale-95 transition-all cursor-pointer"
				>
					<input
						type="file"
						name="file"
						accept="image/*"
						class="hidden"
						onchange={(e) => (e.currentTarget as HTMLInputElement).form?.requestSubmit()}
					/>
					<span class="material-symbols-outlined font-bold text-2xl">add_a_photo</span>
					TÉLÉCHARGER UNE PHOTO
				</label>
			</form>
			<p class="text-[10px] text-slate-500 uppercase tracking-widest text-center">
				Les photos sont partagées avec {settings.host_names}. Respectez l'intimité des invités.
			</p>
		</div>
	</footer>
</div>
