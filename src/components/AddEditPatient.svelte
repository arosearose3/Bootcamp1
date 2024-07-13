<script>
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
    import { isLoading } from '../stores/loading';

    export let selectedPatient = null;
    
// if selectedPatient comes in null, Add New, 
// if selectedPatient is not null, Edit
  
    let name = '';
    let gender = '';
    let dob = '';
    let phone = '';
    let patientID = '';
    let patientResource = null;
  
    let nameError = '';
    let genderError = '';
    let dobError = '';
    let phoneError = '';
  
    let submitButtonText = 'Add Patient';

    const dispatch = createEventDispatcher();

    let response = null;


    onMount(() => {
    if (selectedPatient) {
      // @ts-ignore
      submitButtonText = 'Update Patient';
      name = getColumnValue(selectedPatient, 'name');
      gender = getColumnValue(selectedPatient, 'gender');
      dob = getColumnValue(selectedPatient, 'dob');
      phone = getColumnValue(selectedPatient, 'phone');
      patientID = getColumnValue(selectedPatient, 'id');
    }
  });

  function getColumnValue(patient, column) {
    switch (column) {
      case 'id':
        return patient.id || '';
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

    function validate() {
      let isValid = true;
  
      if (name.trim() === '') {
        nameError = 'Name is required';
        isValid = false;
      } else {
        nameError = '';
      }
  
      if (gender.trim() === '') {
        genderError = 'Gender is required';
        isValid = false;
      } else {
        genderError = '';
      }
  
      if (dob.trim() === '') {
        dobError = 'Date of Birth is required';
        isValid = false;
      } else {
        dobError = '';
      }
  
      const phonePattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
      if (!phonePattern.test(phone)) {
        phoneError = 'Phone number must be in the format 123-456-7890';
        isValid = false;
      } else {
        phoneError = '';
      }
  
      return isValid;
    }
  
    async function handleSubmit() {
    if (validate()) {
      const givenNames = name.split(' ');
      const familyName = givenNames.pop();
      const given = givenNames;

      if (selectedPatient) {
      patientResource = {
        resourceType: 'Patient',
        id: patientID,
        name: [
          {
            given: given,
            family: familyName
          }
        ],
        gender: gender.toLowerCase(),
        birthDate: dob,
        telecom: [
          {
            system: 'phone',
            value: phone,
            use: 'mobile'
          }
        ]
      };} else   //Add New Patient
      
      {
        patientResource = {
        resourceType: 'Patient',
        name: [
          {
            given: given,
            family: familyName
          }
        ],
        gender: gender.toLowerCase(),
        birthDate: dob,
        telecom: [
          {
            system: 'phone',
            value: phone,
            use: 'mobile'
          }
        ]
      };

      }

      isLoading.set(true);
      try {
        if (selectedPatient) {
          response = await fetch(`https://hapi.fhir.org/baseR4/Patient/${patientID}`, {
          
          method: 'PUT',
          headers: {
            'Content-Type': 'application/fhir+json'
          },
          body: JSON.stringify(patientResource)
        }); } 
        
        else {
        response = await fetch('https://hapi.fhir.org/baseR4/Patient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/fhir+json'
          },
          body: JSON.stringify(patientResource)
        });}

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);

        isLoading.set(false);


        // Clear form after successful submission
        name = '';
        gender = '';
        dob = '';
        phone = '';
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
  
    function handleCancel() {
      dispatch('cancel');
    }
  </script>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="name">Name:</label>
      <input type="text" id="name" bind:value={name} />
      {#if nameError}
        <span class="error">{nameError}</span>
      {/if}
    </div>
  
    <div>
      <label for="gender">Gender:</label>
      <select id="gender" bind:value={gender}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="unknown">Unknown</option>
      </select>
      {#if genderError}
        <span class="error">{genderError}</span>
      {/if}
    </div>
    
      <div>
        <label for="dob">Date of Birth:</label>
        <input type="date" id="dob" bind:value={dob} />
        {#if dobError}
          <span class="error">{dobError}</span>
        {/if}
      </div>
    
      <div>
        <label for="phone">Phone Number:</label>
        <input type="text" id="phone" bind:value={phone} placeholder="123-456-7890" />
        {#if phoneError}
          <span class="error">{phoneError}</span>
        {/if}
      </div>
    
      <button type="submit">{submitButtonText}</button>
      <button type="button" on:click={handleCancel}>Cancel</button>
    </form>
    
    <style>
      form {
        max-width: 400px;
        margin: 0 auto;
        padding: 1em;
        background: #f9f9f9;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    
      div {
        margin-bottom: 1em;
      }
    
      label {
        display: block;
        margin-bottom: 0.5em;
      }
    
      input {
        width: 100%;
        padding: 0.5em;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    
      .error {
        color: red;
        font-size: 0.875em;
      }
    
      button {
        padding: 0.7em;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
      }
    
      button:hover {
        background-color: #0056b3;
      }
    </style>

  