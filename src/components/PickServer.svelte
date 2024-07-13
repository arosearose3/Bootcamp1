<script>
    import { selectedFHIRServer } from '../stores/loading'; 
    import { get } from 'svelte/store';
    
    // List of URLs from the HL7 FHIR Public Test Servers page
    const fhirServers = [
    { name: "HAPI FHIR R4", url: "http://hapi.fhir.org/baseR4" },
  //  { name: "Inferno Community", url: "https://inferno.healthit.gov/community" },
    { name: "Smart Health IT", url: "https://r3.smarthealthit.org" },


//{ name: "Health Samurai's FHIR Server", url: "https://health-samurai.io/aidbox" },
    { name: "AEGIS WildFHIR R4", url: "https://wildfhir4.aegis.net/fhir4-0-1" },
    { name: "AEGIS WildFHIR STU3", url: "https://wildfhir3.aegis.net/fhir3-0-2" },
    { name: "AEGIS WildFHIR DSTU2", url: "https://wildfhir2.aegis.net/fhir1-0-2" },
    { name: "NLM's HAPI FHIR DSTU3", url: "https://lforms-fhir.nlm.nih.gov/baseDstu3" },
    { name: "NLM's HAPI FHIR R4", url: "https://lforms-fhir.nlm.nih.gov/baseR4" }
  
    ];
  
    let selectedServer = fhirServers[0].url;
  
    function updateServer(event) {
      selectedFHIRServer.set(event.target.value);
    }
  
    // Initialize the store with the default server URL
    selectedFHIRServer.set(selectedServer);
  </script>
  
  <style>

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
  