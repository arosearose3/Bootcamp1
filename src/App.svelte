<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
<link rel="stylesheet" href="./global.css">

<script>

  import Nav from './components/Nav.svelte';

  let currentView = 'patients';
</script>

<Nav on:navigate={e => currentView = e.detail} />


<main>
  <slot></slot>
</main>