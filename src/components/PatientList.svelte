<script>
  import { createEventDispatcher } from 'svelte';

  export let patientList = [];
  const dispatch = createEventDispatcher();

  let sortedPatients = [];
  let sortColumn = 'name';
  let sortDirection = 'asc';
  let isDragging = false;

function handleMouseDown() {
  isDragging = false;
}

function handleMouseMove() {
  isDragging = true;
}

function handleMouseUp(patient) {
  if (!isDragging) {
    editPatient(patient);
  }
  isDragging = false;
}

  $: sortedPatients = sortPatients(patientList, sortColumn, sortDirection);

  function sortPatients(patients, column, direction) {
    return [...patients].sort((a, b) => {
      let aValue = getColumnValue(a, column);
      let bValue = getColumnValue(b, column);
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  function getColumnValue(patient, column) {
    switch (column) {
      case 'name':
        return getPatientName(patient);
      case 'gender':
        return patient.gender || '';
      case 'dob':
        return patient.birthDate || '';
      case 'phone':
        return patient.telecom && patient.telecom.length > 0 
          ? patient.telecom.find(t => t.system === 'phone')?.value || '' 
          : '';
      default:
        return '';
    }
  }

  function getPatientName(patient) {
    if (patient.name && patient.name.length > 0) {
      const name = patient.name[0];
      const given = name.given ? name.given.join(' ') : '';
      return `${given} ${name.family}`.trim();
    }
    return '';
  }

  function sortBy(column) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }

  function editPatient(patient) {
    dispatch('edit', patient);
  }



  
</script>

<table>
  <thead>
    <tr>
      <th on:click={() => sortBy('name')}>
        Name
        {#if sortColumn === 'name'}
          {#if sortDirection === 'asc'}
            ↑
          {:else}
            ↓
          {/if}
        {/if}
      </th>
      <th on:click={() => sortBy('gender')}>
        Gender
        {#if sortColumn === 'gender'}
          {#if sortDirection === 'asc'}
            ↑
          {:else}
            ↓
          {/if}
        {/if}
      </th>
      <th on:click={() => sortBy('dob')}>
        DOB
        {#if sortColumn === 'dob'}
          {#if sortDirection === 'asc'}
            ↑
          {:else}
            ↓
          {/if}
        {/if}
      </th>
      <th on:click={() => sortBy('phone')}>
        Phone
        {#if sortColumn === 'phone'}
          {#if sortDirection === 'asc'}
            ↑
          {:else}
            ↓
          {/if}
        {/if}
      </th>
    </tr>
  </thead>
  <tbody>
    {#each sortedPatients as patient}
      <tr 
        on:mousedown={handleMouseDown}
        on:mousemove={handleMouseMove}
        on:mouseup={() => handleMouseUp(patient)}
        class="patient-row"
      >
        <td>{getColumnValue(patient, 'name')}</td>
        <td>{getColumnValue(patient, 'gender')}</td>
        <td>{getColumnValue(patient, 'dob')}</td>
        <td>{getColumnValue(patient, 'phone')}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
  }

  th, td {
    padding: 0.5em;
    border: 1px solid #ccc;
    text-align: left;
  }

  th {
    cursor: pointer;
    background-color: #f9f9f9;
  }

  th:hover {
    background-color: #e9e9e9;
  }

  .patient-row:hover {
    background-color: #f1f1f1;
  }

  .sort-indicator {
    margin-left: 5px;
  }
</style>
