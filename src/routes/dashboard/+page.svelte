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
	let showNameDialog = $state(false);
	let nameInput = $state('');

	const STORAGE_KEY = 'diapo-guest-name';

	onMount(() => {
		const serverList = data.fileList ?? [];
		if (browser) {
			const storedName = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('guestName');
			if (storedName) {
				guestName = storedName;
				localStorage.setItem(STORAGE_KEY, storedName);
			} else {
				showNameDialog = true;
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

	function openNameDialog() {
		nameInput = guestName;
		showNameDialog = true;
	}

	function submitName(e: Event) {
		e.preventDefault();
		const trimmed = nameInput.trim();
		if (trimmed) {
			guestName = trimmed;
			if (browser) localStorage.setItem(STORAGE_KEY, trimmed);
			showNameDialog = false;
		}
	}

	function closeNameDialog() {
		if (guestName) {
			showNameDialog = false;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!guestName.trim()) {
			showNameDialog = true;
			return;
		}
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
				<span class="text-primary text-2xl">Mes photos</span>
			</div>
			<button
				type="button"
				onclick={openNameDialog}
				class="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary/90 hover:bg-primary/10 transition-colors text-sm font-medium"
				title="Changer le nom"
			>
				<span class="material-symbols-outlined text-lg">badge</span>
				<span class="hidden sm:inline">{guestName || 'Mon nom'}</span>
			</button>
		</div>
	</header>

	{#if showNameDialog}
		<div
			class="name-dialog-backdrop"
			role="dialog"
			aria-modal="true"
			aria-labelledby="name-dialog-title"
			tabindex="-1"
			onkeydown={(e) => {
				if (e.key === 'Escape') closeNameDialog();
			}}
			onclick={(e) => e.target === e.currentTarget && closeNameDialog()}
		>
			<div class="name-dialog-box">
				<h2 id="name-dialog-title" class="name-dialog-title">Qui es-tu ?</h2>
				<p class="name-dialog-desc">Le nom sera affiché à côté des photos partagées.</p>
				<form onsubmit={submitName} class="name-dialog-form">
					<input
						type="text"
						bind:value={nameInput}
						placeholder="Votre nom et prénom"
						class="name-dialog-input"
						required
					/>
					<button type="submit" class="name-dialog-submit">Valider</button>
				</form>
			</div>
		</div>
	{/if}

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
				<input type="hidden" name="name" value={guestName} />
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
				Les photos sont partagées avec tout le monde. Pas de bêtises, merci !
			</p>
		</div>
	</footer>
</div>

<style>
	.name-dialog-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(6px);
		animation: name-dialog-fade-in 0.2s ease-out;
	}
	.name-dialog-box {
		background: linear-gradient(145deg, rgba(30, 27, 22, 0.98), rgba(20, 18, 14, 0.98));
		border: 1px solid rgba(244, 192, 37, 0.25);
		border-radius: 1rem;
		padding: 2rem;
		min-width: 320px;
		max-width: 90vw;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(244, 192, 37, 0.08);
		animation: name-dialog-scale-in 0.25s ease-out;
	}
	.name-dialog-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
		margin: 0 0 0.5rem 0;
		letter-spacing: 0.02em;
	}
	.name-dialog-desc {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.55);
		margin: 0 0 1.5rem 0;
		line-height: 1.4;
	}
	.name-dialog-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.name-dialog-input {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.06);
		color: #fff;
		font-size: 1rem;
		transition: border-color 0.2s, box-shadow 0.2s;
	}
	.name-dialog-input::placeholder {
		color: rgba(255, 255, 255, 0.4);
	}
	.name-dialog-input:focus {
		outline: none;
		border-color: rgba(244, 192, 37, 0.5);
		box-shadow: 0 0 0 3px rgba(244, 192, 37, 0.15);
	}
	.name-dialog-submit {
		padding: 0.75rem 1.5rem;
		background: rgb(244, 192, 37);
		color: #1e1b16;
		font-weight: 700;
		font-size: 0.9rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: transform 0.1s, box-shadow 0.2s;
	}
	.name-dialog-submit:hover {
		box-shadow: 0 4px 20px rgba(244, 192, 37, 0.35);
	}
	.name-dialog-submit:active {
		transform: scale(0.98);
	}
	@keyframes name-dialog-fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes name-dialog-scale-in {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}
</style>
