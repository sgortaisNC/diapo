<script lang="ts">
	import { register } from 'swiper/element/bundle';
	import { getContext } from 'svelte';

	interface ImageItem {
		name?: string;
		url: string;
	}

	let { images = getContext('images') ?? [] }: { images?: ImageItem[] | string[] } = $props();

	register();
</script>

<swiper-container
class="mySwiper"
  space-between="30"
  autoplay-delay="10000"
  loop="true"
  speed="500"
  slides-per-view="1"
  css-mode="true"
>
{#each images as image}
	<swiper-slide>
		<img
			src={typeof image === 'string' ? image : image.url}
			alt={typeof image === 'string' ? '' : image.name ?? ''}
		/>
	</swiper-slide>
{/each}

</swiper-container>

<style>  
  swiper-container {
    width: 100%;
  }
  
  swiper-slide {
    background-position: center;
    background-size: contain;
    width: 100vw;
    height: 100vh;
  }
  
  swiper-slide img {
    display: block;
    width: 100%;
    object-fit: contain;
    height: 100%;
  }
</style>