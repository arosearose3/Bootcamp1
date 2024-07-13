<script>
  import { createEventDispatcher } from 'svelte';
  export let patients = [];
  const dispatch = createEventDispatcher();

  let sortedPatients = [];
  let sortColumn = 'name';
  let sortDirection = 'asc';

  $: sortedPatients = sortPatients(patients, sortColumn, sortDirection);

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

  function getSortIndicator(column) {
    if (column === sortColumn) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  }
</script>

<table>
  <thead>
    <tr>
      <th on:click={() => sortBy('name')}>Name {getSortIndicator('name')}</th>
      <th on:click={() => sortBy('gender')}>Gender {getSortIndicator('gender')}</th>
      <th on:click={() => sortBy('dob')}>DOB {getSortIndicator('dob')}</th>
      <th on:click={() => sortBy('phone')}>Phone {getSortIndicator('phone')}</th>
    </tr>
  </thead>
  <tbody>
    {#each sortedPatients as patient}
      <tr on:click={() => editPatient(patient)} class="patient-row">
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
