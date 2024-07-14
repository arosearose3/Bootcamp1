<link rel="stylesheet" href="../global.css">
<script>
  import { createEventDispatcher } from 'svelte';
  import Patients from '../components/Patients.svelte';
  import SearchPatient from '../components/SearchPatient.svelte';
  import Nav from '../components/Nav.svelte';

  let currentView = 'patients';
  const dispatch = createEventDispatcher();

  function handleNavigate(event) {
    
    currentView = event.detail;
    console.log(`View changed to: ${currentView}`);
    dispatch('viewChange', { view: currentView });
  }
</script>

<Nav on:navigate={handleNavigate} />

<main>
  {#if currentView === 'patients'}
    <Patients />
  {:else if currentView === 'search'}
    <SearchPatient  />
  {/if}
</main>
