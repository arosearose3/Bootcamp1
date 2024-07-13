<!-- src/components/Nav.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    import LoadingIndicator from './LoadingIndicator.svelte';
	  import PickServer from './PickServer.svelte';
  
    const dispatch = createEventDispatcher();
  
    function showPatients() {
      dispatch('navigate', 'patients');
    }
  
    function showSearch() {
      dispatch('navigate', 'search');
    }
</script>
  
  <nav>
    <PickServer />
    <button on:click={showPatients}>Patients</button>
    <button on:click={showSearch}>Search</button>
    
    <LoadingIndicator />
    
  </nav>
  
  <style>
    nav {
      background-color: #e6d8d8;
      padding: 1em;
      display: flex;
      align-items: center;
      color: white; /* Ensures all text within nav has a white color */
    }

  </style>
  