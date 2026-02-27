<script lang="ts">
	interface Props {
		title?: string;
		badge?: string;
		liveView?: boolean;
		onLiveViewToggle?: () => void;
		onRefresh?: () => void;
	}
	let {
		title = 'Modération des photos',
		badge = 'Événement en direct',
		liveView = false,
		onLiveViewToggle,
		onRefresh
	}: Props = $props();
</script>

<header class="h-20 bg-dark-surface border-b border-dark-border flex items-center justify-between px-8 shrink-0">
	<div class="flex items-center space-x-4">
		<h2 class="text-xl font-medium text-white">{title}</h2>
		<span class="px-2 py-1 rounded bg-gold-primary/20 text-gold-primary text-[10px] uppercase font-bold tracking-widest"
			>{badge}</span
		>
	</div>
	<div class="flex items-center space-x-6">
		{#if onLiveViewToggle}
			<div class="flex items-center space-x-3">
				<span class="text-sm text-gray-400 font-medium">Vue en direct</span>
				<button
					type="button"
					aria-label="Toggle live view"
					class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2 focus:ring-offset-dark-bg {liveView
						? 'bg-gold-primary'
						: 'bg-gray-700'}"
					onclick={onLiveViewToggle}
					data-purpose="live-toggle"
				>
					<span
						class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {liveView ? 'translate-x-6' : 'translate-x-1'}"
					></span>
				</button>
			</div>
		{/if}
		{#if onRefresh}
			<button
				type="button"
				class="bg-gold-primary hover:bg-gold-light text-dark-bg font-bold py-2 px-6 rounded-md transition-all duration-300 text-sm"
				onclick={onRefresh}
			>
				Actualiser
			</button>
		{/if}
	</div>
</header>
