<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(:root){
		--primary-color: rgb(10, 0, 56);
	}
	:global(*){
		box-sizing: border-box;
	}

	:global(html,body){
		margin:0;
		padding:0;
		background-color: var(--primary-color);
		color: white;
		font-family: Arial, Helvetica, sans-serif;
	}
	:global(.container){
		width: min(100%, 1200px);
		margin: 0 auto;
		padding: 20px;
	}
</style>