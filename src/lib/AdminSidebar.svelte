<script lang="ts">
	interface Props {
		totalPhotos?: number;
		pendingCount?: number;
		approvedCount?: number;
		activeRoute?: string;
	}
	let { totalPhotos = 0, pendingCount = 0, approvedCount = 0, activeRoute = 'moderation' }: Props = $props();
</script>

<aside class="w-72 bg-dark-surface border-r border-dark-border flex flex-col shrink-0">
	<div class="p-8 border-b border-dark-border">
		<h1 class="text-2xl font-serif font-bold text-gold-primary tracking-widest">LUXE<span class="text-white">EVENT</span></h1>
		<p class="text-xs text-gray-500 mt-1 uppercase tracking-tighter">Moderation Console</p>
	</div>
	<div class="p-6 space-y-6">
		<div class="space-y-4">
			<h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Event Stats</h2>
			<div class="p-4 rounded-lg bg-dark-bg border border-dark-border">
				<p class="text-sm text-gray-400">Total Photos</p>
				<p class="text-2xl font-semibold text-white">{totalPhotos.toLocaleString()}</p>
			</div>
			<div class="p-4 rounded-lg bg-dark-bg border border-dark-border border-l-4 border-l-gold-primary">
				<p class="text-sm text-gray-400">Pending Review</p>
				<p class="text-2xl font-semibold text-gold-primary">{pendingCount.toLocaleString()}</p>
			</div>
			<div class="p-4 rounded-lg bg-dark-bg border border-dark-border">
				<p class="text-sm text-gray-400">Approved</p>
				<p class="text-2xl font-semibold text-green-500">{approvedCount.toLocaleString()}</p>
			</div>
		</div>
		<nav class="space-y-2">
			<a
				href="/admin"
				class="flex items-center space-x-3 p-3 rounded-md {activeRoute === 'moderation'
					? 'bg-gold-primary/10 text-gold-primary'
					: 'hover:bg-white/5 transition-colors text-gray-400 hover:text-white'}"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
				<span>Moderation Queue</span>
			</a>
			<button
				type="button"
				class="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-white/5 transition-colors text-gray-400 hover:text-white text-left"
				aria-label="Event Settings"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
				</svg>
				<span>Event Settings</span>
			</button>
		</nav>
	</div>
	<div class="mt-auto p-6 border-t border-dark-border">
		<div class="flex items-center space-x-3">
			<div class="w-10 h-10 rounded-full bg-gold-primary flex items-center justify-center text-dark-bg font-bold">JD</div>
			<div>
				<p class="text-sm font-medium text-white">Admin Moderator</p>
				<p class="text-xs text-gray-500 italic">Moderator</p>
			</div>
		</div>
	</div>
</aside>
