<script>
  import PatientList from './PatientList.svelte';
  import AddEditPatient from './AddEditPatient.svelte';
  import { onMount, createEventDispatcher } from 'svelte';
  import { isLoading, selectedFHIRServer, patients, patientsPerPage, currentComponent } from '../stores/loading';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { get } from 'svelte/store';


  // Reactive store subscription
  $: component = $currentComponent;

  function handleViewChange(event) {
    const { view } = event.detail;
    console.log(`View changed to: ${view}`);
    currentComponent.set('patients');
    currentComponent.set('patients');

  }

  // Initialize the local variable to the store's value
  $: perPage = $patientsPerPage;

  // Function to handle dropdown value change
  function updatePerPage(event) {
    const value = parseInt(event.target.value);
    patientsPerPage.set(value);
  }

  let selectedPatient = null;
  let buttonText = 'Add Patient'; // Initial button text
  let totalPatients = 0;
  let currentPage = 0;

  const dispatch = createEventDispatcher();

  onMount(() => {
    perPage = $patientsPerPage;
    const viewChangeHandler = event => handleViewChange(event);
    // Listen to the custom event
    window.addEventListener('viewChangePatients', viewChangeHandler);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('viewChangePatients', viewChangeHandler);
    };
  });

  async function fetchPatients(page) {
    const offset = page * $patientsPerPage;
    console.log(`Fetching patients from offset ${offset}`);
    isLoading.set(true);
    if (totalPatients === 0 || totalPatients === undefined) {
      get_patient_count();
    }
    try {
      const serverUrl = get(selectedFHIRServer);
      console.log(`fetching ${$patientsPerPage} patients offset ${offset}`);
      const response = await fetch(`${serverUrl}/Patient?_format=json&_count=${$patientsPerPage}&_getpagesoffset=${offset}`);

      if (!response.ok) {
        // Handle HTTP errors
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.entry) {
        patients.set(data.entry.map(entry => entry.resource));  // Use set method
      } else {
        patients.set([]);  // Use set method
      }
      console.log(`Fetched ${get(patients).length} patients`);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      toast.push(error.message);
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
    console.log('next page, current, total, ppp', currentPage, totalPatients, $patientsPerPage);
    if ((currentPage + 1) * $patientsPerPage < totalPatients) {
      currentPage += 1;
      fetchPatients(currentPage);
    }
    if (totalPatients === 0) fetchPatients(0);
  }

  function goToLastPage() {
    if (totalPatients > 9999) {
      currentPage = Math.floor(9999 / patientsPerPage);
    } else {
      currentPage = Math.floor(totalPatients / patientsPerPage);
    }

    console.log('last page, current, total, ppp', currentPage, totalPatients, patientsPerPage);

    fetchPatients(currentPage);
  }

  async function get_patient_count() {
    isLoading.set(true);
    try {
      const serverUrl = get(selectedFHIRServer);
      const response = await fetch(`${serverUrl}/Patient?_format=json&_active=true&_total=accurate&_count=1`);
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
    currentComponent.set('addEditPatient');
  }

  function editPatient(event) {
    selectedPatient = event.detail;
    buttonText = 'Update Patient'; // Change button text when editing a patient
    currentComponent.set('addEditPatient');
  }

  function handlePatientSubmit(event) {
    currentComponent.set('patients');
    // get_patient_count(); // Update the patient count after adding/updating a patient
  }

  function handleCancel() {
   currentComponent.set('patients');
  }
</script>

<div>
  <div class="header">
    <span>Click a row to update Patient, Total Patients: {totalPatients}</span>
    <div class="refresh-button">
      <button on:click={get_patient_count}>Refresh Count</button>
    </div>
  </div>

  {#if $currentComponent === 'patients'}
    <button on:click={addPatient}>{buttonText}</button> <!-- Use buttonText for the button label -->
    <br>
    <div>
      <div class="pagination-controls">
        <button on:click={goToFirstPage}>First</button>
        <button on:click={goToPreviousPage}>Previous {$patientsPerPage}</button>
        <button on:click={goToNextPage}>Next {$patientsPerPage}</button>
        <button on:click={goToLastPage}>Last</button>
      </div>
      <div class="fhir-dropdown">
        <label for="patientsPerPage">Patients per page</label>
        <select id="patientsPerPage" bind:value={$patientsPerPage}>
          <option value="12">12</option>
          <option value="48">48</option>
          <option value="108">108</option>
        </select>
      </div>
    </div>
    <PatientList patientList={$patients} on:edit={editPatient} />
  {:else if $currentComponent === 'addEditPatient'}
    <AddEditPatient on:submit={handlePatientSubmit} on:cancel={handleCancel} {selectedPatient} />
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
    margin-bottom: 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #f9f9f9;
    border: 0px solid #ddd;
    border-radius: 5px;
  }

  .refresh-button {
    margin-left: 10px;
  }

  .spacer {
    flex-grow: 1;
  }

  .header label {
    font-weight: bold;
    margin-right: 1em;
  }

  div {
    margin-top: 1em;
  }

  button {
    margin-bottom: 1px;
    margin-right: 1px;
  }
</style>
