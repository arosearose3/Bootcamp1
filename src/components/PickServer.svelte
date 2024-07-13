<script>
    // List of URLs from the HL7 FHIR Public Test Servers page
    const fhirServers = [
      { name: "Argonaut", url: "https://api-v8-r4.hspconsortium.org/argonaut/v8" },
      { name: "HAPI FHIR R4", url: "http://hapi.fhir.org/baseR4" },
      { name: "Mayo Clinic FHIR", url: "https://api.mayo.edu/fhir/r4" },
      { name: "Inferno Community", url: "https://inferno.healthit.gov/community" },
      { name: "Smart Health IT", url: "https://r3.smarthealthit.org" },
      { name: "Cerner Millennium", url: "https://fhir.cerner.com/millennium/r4/1" },
      { name: "Epic USCDI R4", url: "https://open.epic.com/MyApps/Endpoints/USCDI/R4" },
      { name: "Google Healthcare API", url: "https://healthcare.googleapis.com/v1/projects/project-id/locations/location/datasets/dataset/fhirStores/fhir-store/fhir" },
      { name: "IBM FHIR Server", url: "https://ibm.github.io/FHIR" },
      { name: "Microsoft FHIR Server for Azure", url: "https://github.com/microsoft/fhir-server" }
    ];
  
    let selectedServer = fhirServers[0].url;
  </script>
  
  <style>
    .fhir-dropdown {
      margin: 20px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    .fhir-dropdown label {
      font-weight: bold;
    }
    .fhir-dropdown select {
      margin-top: 10px;
      padding: 5px;
      width: 100%;
    }
    .fhir-dropdown p {
      margin-top: 10px;
      color: #333;
    }
  </style>
  
  <div class="fhir-dropdown">
    <label for="fhir-servers">Select a FHIR Server:</label>
    <select id="fhir-servers" bind:value={selectedServer}>
      {#each fhirServers as server}
        <option value={server.url}>{server.name}</option>
      {/each}
    </select>
    
    <p>Selected FHIR Server URL: {selectedServer}</p>
  </div>
  