<script>
  import { register } from 'swiper/element/bundle';
  import { getContext } from 'svelte';
  register();
  
  let images = getContext('images');
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
<swiper-slide><img src={"/api/images/" + image} alt=""></swiper-slide>
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