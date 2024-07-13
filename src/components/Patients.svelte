<script>
  import PatientList from './PatientList.svelte';
  import AddEditPatient from './AddEditPatient.svelte';
  import { onMount, createEventDispatcher } from 'svelte';
  import { isLoading } from '../stores/loading';
  import {selectedFHIRServer} from '../stores/loading';
  import { get } from 'svelte/store';

  export let forceView = 'patients'; // Accept the forceView prop

  let patients = [];
  let currentComponent = forceView;
  let selectedPatient = null;
  let buttonText = 'Add Patient'; // Initial button text
  let totalPatients = 0;
  let patientsPerPage = 12;
  let currentPage = 0;

  const dispatch = createEventDispatcher();

  onMount(() => {
    fetchPatients(currentPage);
    if (totalPatients == 0) get_patient_count();
  });

  async function fetchPatients(page) {
    const offset = page * patientsPerPage;
    console.log(`Fetching patients from offset ${offset}`);
    isLoading.set(true);
    try {
      const serverUrl = get(selectedFHIRServer);
      const response = await fetch(`${serverUrl}/Patient?_count=${patientsPerPage}&_getpagesoffset=${offset}`);
     const data = await response.json();
      if (data.entry) {
        patients = data.entry.map(entry => entry.resource);
      } else {
        patients = [];
      }
      console.log(`Fetched ${patients.length} patients`);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
    isLoading.set(false);
  }

  function goToFirstPage() {
    console.log('Going to first page');
    currentPage = 0;
    fetchPatients(currentPage);
  }

  function goToPreviousPage() {
    console.log('Going to previous page');
    if (currentPage > 0) {
      currentPage -= 1;
      fetchPatients(currentPage);
    }
  }

  function goToNextPage() {
    console.log('next page, current, total, ppp', currentPage, totalPatients, patientsPerPage);
    if ((currentPage + 1) * patientsPerPage < totalPatients) {
      currentPage += 1;
      fetchPatients(currentPage);
    }
  }

  function goToLastPage() {
    currentPage = Math.floor(9999 / patientsPerPage);
    console.log('last page, current, total, ppp', currentPage, totalPatients, patientsPerPage);


    fetchPatients(currentPage);
  }

  async function get_patient_count() {
    isLoading.set(true);
    try {
      const serverUrl = get(selectedFHIRServer);
      const response = await fetch(`${serverUrl}/Patient?active=true&_total=accurate&_count=1`);
      const data = await response.json();
      totalPatients = data.total;
    } catch (error) {
      console.error('Failed to fetch patient count:', error);
    }
    isLoading.set(false);
  }

  function addPatient() {
    selectedPatient = null;
    buttonText = 'Add Patient'; // Reset button text when adding a new patient
    currentComponent = 'addEditPatient';
  }

  function editPatient(event) {
    selectedPatient = event.detail;
    buttonText = 'Update Patient'; // Change button text when editing a patient
    currentComponent = 'addEditPatient';
  }

  function handlePatientSubmit(event) {
    currentComponent = 'patients';
    // get_patient_count(); // Update the patient count after adding/updating a patient
  }

  function handleCancel() {
    currentComponent = 'patients';
  }
</script>

<div>
  <div class="header">
    Click a row to update Patient,
    Total Patients: {totalPatients}
  
    <div class="refresh-button">
      <button on:click={get_patient_count}>Refresh Count</button>
    </div>
  </div>

  {#if currentComponent === 'patients'}
    <button on:click={addPatient}>{buttonText}</button> <!-- Use buttonText for the button label -->
    <br>
    <div class="pagination-controls">
      <button on:click={goToFirstPage}>Start</button>
      <button on:click={goToPreviousPage}>Previous 12</button>
      <button on:click={goToNextPage}>Next 12</button>
      <button on:click={goToLastPage}>End</button>
    </div>
    <PatientList {patients} on:edit={editPatient} />

  {:else if currentComponent === 'addEditPatient'}
    <AddEditPatient on:submit={handlePatientSubmit} on:cancel={handleCancel}  {selectedPatient} />
  {/if}
  <br>
  <!-- <pre>{JSON.stringify(patients, null, 2)}</pre> -->
</div>

<style>
  .pagination-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 1em;
  }


  .header {
    display: flex;
    flex-direction: column;
    margin-bottom: 1em;
  }
  .spacer {
    flex-grow: 1;
  }
  .refresh-button {
    text-align: left;
  }

  .header label {
    font-weight: bold;
    margin-right: 1em;
  }

  div {
    margin-top: 1em;
  }

  button {
    margin-bottom: 1em;
    margin-right: 1em; /* Ensure space between buttons */
  }
</style>
