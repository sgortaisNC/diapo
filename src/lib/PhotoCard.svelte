<script lang="ts">
	interface Photo {
		name: string;
		url: string;
	}
	interface Props {
		photo: Photo;
		status?: 'pending' | 'approved' | 'rejected';
		showActions?: boolean;
		onApprove?: () => void;
		onReject?: () => void;
		onDelete?: () => void;
	}
	let {
		photo,
		status = 'pending',
		showActions = true,
		onApprove,
		onReject,
		onDelete
	}: Props = $props();
</script>

<div
	class="group relative aspect-square bg-dark-surface rounded-lg overflow-hidden border border-dark-border hover:border-gold-primary/50 transition-all duration-500 shadow-2xl"
	data-purpose="photo-card"
>
	<img
		alt={photo.name || 'Event photo'}
		class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
		src={photo.url}
	/>
	{#if showActions && (onApprove || onReject)}
		<div
			class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
		>
			<div class="flex space-x-2">
				{#if onApprove}
					<button
						type="button"
						class="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-md font-semibold text-sm transition-colors shadow-lg"
						onclick={onApprove}
					>
						Approve
					</button>
				{/if}
				{#if onReject}
					<button
						type="button"
						class="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-md font-semibold text-sm transition-colors shadow-lg"
						onclick={onReject}
					>
						Reject
					</button>
				{/if}
			</div>
		</div>
	{/if}
	{#if showActions}
		<div class="absolute top-3 left-3">
			<span
				class="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] border border-white/10 uppercase tracking-widest font-bold {status ===
				'approved'
					? 'text-green-400'
					: status === 'rejected'
						? 'text-red-400'
						: 'text-gold-light'}"
			>
				{status}
			</span>
		</div>
	{/if}
</div>
