<script>
  import PatientList from "./PatientList.svelte";
  import VSACtest from './VSACtest.svelte';
  import { isLoading } from '../stores/loading';
  import { selectedFHIRServer } from '../stores/loading';
  import { get } from 'svelte/store';

  let name = '';
  let phone = '';
  let results = [];
  let nextBatchUrl = null; // Store the URL for the next batch of results

  async function fetchBatch(url) {
    isLoading.set(true);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.entry) {
      results = results.concat(data.entry.map(entry => entry.resource));
    }
    isLoading.set(false);
    // Find the URL for the next page of results
    nextBatchUrl = null;
    if (data.link) {
      const nextLink = data.link.find(link => link.relation === 'next');
      if (nextLink) {
        nextBatchUrl = nextLink.url;
      }
    }
  }

  async function search() {
    try {
      const serverUrl = get(selectedFHIRServer);
      let urlBase = `${serverUrl}/Patient?`;
      const nameParts = name.trim().split(' ');

      let familyName = '';
      let givenNames = '';
      let url = urlBase;

      if (nameParts.length > 1) {
        // If more than one part, treat last part as family name and the rest as given names
        familyName = nameParts.pop();
        givenNames = nameParts.join(' ');

        if (givenNames) {
          url += `given=${encodeURIComponent(givenNames)}&`;
        }
        if (familyName) {
          url += `family=${encodeURIComponent(familyName)}&`;
        }
      } else if (nameParts.length === 1) {
        // If only one part, perform two searches: one for given name and one for family name
        familyName = nameParts[0];

        let urlGiven = `${urlBase}given=${encodeURIComponent(familyName)}`;
        let urlFamily = `${urlBase}family=${encodeURIComponent(familyName)}`;

        results = []; // Clear previous results
        isLoading.set(true);
        await fetchBatch(urlGiven);
        await fetchBatch(urlFamily);
        isLoading.set(false);
        return;
      }

      if (phone) {
        url += `telecom=${encodeURIComponent(phone)}&`;
      }

      url = url.slice(0, -1); // Remove the trailing "&"
      results = []; // Clear previous results
      isLoading.set(true);
      await fetchBatch(url); // Fetch the first batch of results
      isLoading.set(false);
    } catch (error) {
      console.error('Error:', error);
      results = [];
    }
  }

  async function fetchNextBatch() {
    if (nextBatchUrl) {
      await fetchBatch(nextBatchUrl);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      search();
    }
  }
</script>

<!-- <VSACtest /> -->
<!-- <br> -->

<div>
  <input type="text" placeholder="Enter Name" bind:value={name} on:keydown={handleKeydown} />
  <input type="text" placeholder="Enter Phone" bind:value={phone} on:keydown={handleKeydown} />
  <button on:click={search}>Search</button>
  <button on:click={fetchNextBatch} disabled={!nextBatchUrl}>Next Batch</button>

  <div>
    {#if results.length > 0}
      <PatientList patientList={results} />
    {:else}
      <p>No patients found</p>
    {/if}
  </div>
</div>

<style>
  input {
    margin-right: 10px;
  }
  button {
    margin-top: 10px;
    margin-right: 10px;
  }
</style>
