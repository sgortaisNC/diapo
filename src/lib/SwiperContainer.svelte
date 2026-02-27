<script lang="ts">
import { register } from 'swiper/element/bundle';
import { getContext, onMount, createEventDispatcher } from 'svelte';

interface ImageItem {
	name?: string;
	url: string;
}

const dispatch = createEventDispatcher();

let { images = getContext('images') ?? [] }: { images?: ImageItem[] | string[] } = $props();

let swiperEl: HTMLElement;

register();

onMount(() => {
	if (!swiperEl) return;
	// @ts-expect-error - swiper est ajouté dynamiquement par la lib
	const instance = swiperEl.swiper;
	if (!instance) return;

	instance.on('slideChange', () => {
		dispatch('slideChange', { activeIndex: instance.realIndex ?? instance.activeIndex ?? 0 });
	});
});
</script>

<swiper-container
	bind:this={swiperEl}
	class="mySwiper"
	space-between="30"
	loop="true"
	speed="800"
	slides-per-view="1"
	effect="fade"
	fade-effect-cross-fade="true"
	autoplay-delay="10000"
	autoplay-disable-on-interaction="false"
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