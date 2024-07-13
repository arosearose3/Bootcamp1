<!-- src/components/WalkingParenthesis.svelte -->
<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import { isLoading } from '../src/stores/loading';
  import { get } from 'svelte/store';

  let parenthesis = '}';
  let x = tweened(0, {
    duration: 2000,
    easing: cubicInOut
  });

  let direction = 1; // 1 means moving right, -1 means moving left

  function animate() {
    x.set(direction === 1 ? 80 : 0); // Move between 0 and 80 pixels (within 300px container with some padding)
  }

  // Listen for changes in the tweened value and update direction and parenthesis
  $: x.subscribe(value => {
    if (get(isLoading)) {
      if (value === 0) {
        direction = 1;
        parenthesis = '}';
        animate();
      } else if (value === 80) {
        direction = -1;
        parenthesis = '{';
        animate();
      }
    }
  });

  // Reactively start/stop animation based on isLoading
  $: if ($isLoading) {
    animate();
  } else {
    x.set(0); // Reset position when not loading
  }

  onMount(() => {
    if (get(isLoading)) {
      animate(); // Start animation when the component mounts
    }
  });
</script>

{#if $isLoading}
<div class="container">
  <span class="parenthesis" style="transform: translateX({$x}px);">{parenthesis}</span>
</div>
{/if}

<style>
  .container {
    width: 80px; /* Container width */
    height: 30px; /* Container height */
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    border: 0px solid black;
  }

  .parenthesis {
    position: absolute;
    font-size: 1em; /* Adjust as needed */
  }
</style>
