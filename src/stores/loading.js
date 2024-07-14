// src/stores/loading.js
import { writable } from 'svelte/store';

export const isLoading = writable(false);
export const selectedFHIRServer = writable('http://hapi.fhir.org/baseR4');
export const patients = writable([]);
export const patientsPerPage = writable(12);
export const currentComponent = writable('patients');





