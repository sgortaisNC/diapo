<script lang="ts">
     export let data; 

    import SwiperContainer from '$lib/SwiperContainer.svelte';
    import { setContext } from 'svelte';

    let liste = data.fileList;

    let images = setContext('images', liste);
    
</script>

<SwiperContainer />