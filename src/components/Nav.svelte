<!-- src/components/Nav.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    import LoadingIndicator from './LoadingIndicator.svelte';
	  import PickServer from './PickServer.svelte';
    import { patientsPerPage } from '../stores/loading';
  
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

  <div class="nav-buttons">
    <button on:click={showPatients}>Patients</button>
    <button on:click={showSearch}>Search</button>
  </div>

  <div class="loading-indicator-container">
    <LoadingIndicator />
  </div>

</nav>

<style>
  nav {
    background-color: #e6d8d8;
    padding: 1em;
    display: flex;
    flex-direction: column; /* Stack items vertically */
    align-items: flex-start; /* Align items to the start */
    color: white; /* Ensures all text within nav has a white color */
  }

  .loading-indicator-container {
    height: 50px; /* Set a fixed height */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-buttons {
    display: flex;
    gap: 1em; /* Space between buttons */
    margin-top: 1em; /* Space above buttons */
  }

  button {
    font-family: 'Roboto', sans-serif;
    background-color: grey;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
  }

  button:hover {
    background-color: lightyellow;
    color: darkgrey;
  }

  button:active {
    background-color: yellow;
    color: darkgrey;
  }
</style>
