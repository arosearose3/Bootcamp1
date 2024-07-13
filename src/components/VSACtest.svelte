<script>
    import { onMount } from 'svelte';
  
    let result = '';
    const svsServerBase = 'https://vsac.nlm.nih.gov/vsac/svs/';
    const username = 'arosearose'; 
    const password = '34ea63e5-6bd1-4963-bede-24866d3deff9'; 
  
    async function fetchData() {
      try {
        const valueToEncode = `${username}:${password}`;
        const basicAuthHeader = 'Basic ' + btoa(valueToEncode);
  
        const testUrl = `${svsServerBase}RetrieveMultipleValueSets?id=2.16.840.1.113762.1.4.1029.256`;
  
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Authorization': basicAuthHeader
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.text();
        result = data;
      } catch (error) {
        console.error('Error fetching data:', error);
        result = 'Error fetching data';
      }
    }
  
    onMount(() => {
      fetchData();
    });
  </script>
  
  <style>
    .result-container {
      white-space: pre-wrap;
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 5px;
    }
  </style>
  
  <div>
    <h4>VSAC Test</h4>
    <div class="result-container">
      {#if result}
        {result}
      {:else}
        <p>Loading...</p>
      {/if}
    </div>
  </div>
  