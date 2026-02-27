<script lang="ts">
	import type { PageProps } from './$types';
	import { invalidateAll } from '$app/navigation';
	import AdminSidebar from '$lib/AdminSidebar.svelte';
	import AdminHeader from '$lib/AdminHeader.svelte';
	import PhotoCard from '$lib/PhotoCard.svelte';

	let { data }: PageProps = $props();

	let liveView = $state(false);

	async function deleteImage(file: { name: string; url: string }) {
		const response = await fetch(`/api/remove`, {
			method: 'DELETE',
			body: JSON.stringify({ url: file.url })
		});
		const removed: { ok: boolean } = await response.json();
		if (removed.ok) {
			await invalidateAll();
		}
	}

	async function handleRefresh() {
		await invalidateAll();
	}
</script>

<div class="flex h-screen overflow-hidden bg-dark-bg text-gray-200 font-sans antialiased">
	<AdminSidebar
		totalPhotos={data.fileList.length}
		pendingCount={data.fileList.length}
		approvedCount={0}
		activeRoute="moderation"
	/>
	<main class="flex-1 flex flex-col overflow-hidden">
		<AdminHeader
			title="Moderation Queue"
			badge="Live Event"
			liveView={liveView}
			onLiveViewToggle={() => (liveView = !liveView)}
			onRefresh={handleRefresh}
		/>
		<section class="flex-1 overflow-y-auto p-8 bg-dark-bg" data-purpose="photo-grid-container">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each data.fileList as file (file.url)}
					<PhotoCard
						photo={file}
						status="pending"
						showActions={true}
						onApprove={() => {}}
						onReject={() => deleteImage(file)}
					/>
				{/each}
			</div>
		</section>
	</main>
</div>

<style>
	:global(.dark-bg::-webkit-scrollbar) {
		width: 6px;
	}
	:global(.dark-bg::-webkit-scrollbar-track) {
		background: #121212;
	}
	:global(.dark-bg::-webkit-scrollbar-thumb) {
		background: #d4af37;
		border-radius: 10px;
	}
</style>

