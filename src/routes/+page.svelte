
<link rel="stylesheet" href="../global.css">
<script>
  import Patients from '../components/Patients.svelte';
  import SearchPatient from '../components/SearchPatient.svelte';
  import Nav from '../components/Nav.svelte';

  let currentView = 'patients';

  function handleNavigate(event) {
    currentView = event.detail;
  }
</script>

<Nav on:navigate={handleNavigate} />

<main>
  {#if currentView === 'patients'}
    <Patients />
  {:else if currentView === 'search'}
    <SearchPatient />
  {/if}
</main>
