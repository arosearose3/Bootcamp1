<script>
  import { onMount, onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import { isLoading } from '../stores/loading';
  import { get } from 'svelte/store';

  let rectangles = [
    { id: 1, x: tweened(10, { duration: 1000, easing: cubicInOut }) }, 
    { id: 2, x: tweened(10, { duration: 1000, easing: cubicInOut }) }, 
    { id: 3, x: tweened(10, { duration: 1000, easing: cubicInOut }) }
  ];

  function animate() {
    rectangles.forEach((rectangle, index) => {
      setTimeout(() => {
        rectangle.x.set(20);
        setTimeout(() => {
          rectangle.x.set(10);
        }, 1000);
      }, index * 500);
    });
  }

  let interval;
  $: if (get(isLoading)) {
    animate();
    interval = setInterval(animate, 1500);
  } else {
    clearInterval(interval);
  }

  onMount(() => {
    if (get(isLoading)) {
      animate();
      interval = setInterval(animate, 1500);
    }
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

{#if $isLoading}
  <br>... loading ...<br> 
  <div class="container">
    {#each rectangles as rectangle}
      <span class="rectangle" style="width: {rectangle.x}px; height: {rectangle.x / 3}px;"></span>
    {/each}
  </div>
{/if}

<style>
  .container {
    width: 100px; /* Container width */
    height: 30px; /* Container height */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .rectangle {
    background-color: black;
    margin: 0 5px;
    display: inline-block;
    transition: width 0.3s, height 0.3s; /* Ensure smooth expansion and contraction */
  }
</style>
