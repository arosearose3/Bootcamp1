<script>
    import { selectedFHIRServer } from '../stores/loading'; 
    import { get } from 'svelte/store';
    
    // List of URLs from the HL7 FHIR Public Test Servers page
    const fhirServers = [
      { name: "Argonaut", url: "https://api-v8-r4.hspconsortium.org/argonaut/v8" },
      { name: "* HAPI FHIR R4", url: "http://hapi.fhir.org/baseR4" },
      { name: "Mayo Clinic FHIR", url: "https://api.mayo.edu/fhir/r4" },
      { name: "Inferno Community", url: "https://inferno.healthit.gov/community" },
      { name: "* Smart Health IT", url: "https://r3.smarthealthit.org" },
      { name: "Cerner Millennium", url: "https://fhir.cerner.com/millennium/r4/1" },
      { name: "Epic USCDI R4", url: "https://open.epic.com/MyApps/Endpoints/USCDI/R4" },
      { name: "Google Healthcare API", url: "https://healthcare.googleapis.com/v1/projects/project-id/locations/location/datasets/dataset/fhirStores/fhir-store/fhir" },
      { name: "IBM FHIR Server", url: "https://ibm.github.io/FHIR" },
      { name: "Microsoft FHIR Server for Azure", url: "https://github.com/microsoft/fhir-server" }
    ];
  
    let selectedServer = fhirServers[0].url;
  
    function updateServer(event) {
      selectedFHIRServer.set(event.target.value);
    }
  
    // Initialize the store with the default server URL
    selectedFHIRServer.set(selectedServer);
  </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.fhir-dropdown {
  margin: 20px;
  padding: 10px;
  border: 0px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.fhir-dropdown label {
  font-weight: bold;
  color: #333;
}

.fhir-dropdown select {
  font-family: 'Roboto', sans-serif;
  background-color: grey;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: left;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.fhir-dropdown select:hover {
  background-color: lightyellow;
  color: darkgrey;
}

.fhir-dropdown select:active {
  background-color: yellow;
  color: darkgrey;
}

.fhir-dropdown p {
  margin-top: 10px;
  color: #750f0f;
}
  </style>
  
  <div class="fhir-dropdown">
    <label for="fhir-servers"></label>
    <select id="fhir-servers" bind:value={selectedServer} on:change={updateServer}>
      {#each fhirServers as server}
        <option value={server.url}>{server.name}</option>
      {/each}
    </select>
    
    <p>{selectedServer}</p>
  </div>
  