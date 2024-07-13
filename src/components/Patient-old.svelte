<script>
    export let name;
    export let gender;
    export let dob;
    export let phone;
  </script>
  
  <div class="patient">
    <span> {name}, {gender}, {dob}, {phone}</span>

  </div>
  
  <style>
    .patient {
      padding: 0.5em;
      border-bottom: 1px solid #ccc;
      margin-bottom: 0.5em;
    }
    
    span {
      display: inline-block;
      margin-right: 0.5em;
    }
  </style>
  