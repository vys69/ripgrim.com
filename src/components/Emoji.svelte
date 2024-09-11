<script>
    export let src = '';
    export let alt = '';
    export let size = '1em';
  </script>
  
  <img {src} {alt} style="width: {size}; height: {size}; vertical-align: middle; display: inline-block;" />
  
  <style>
    img {
      margin: 0 0.1em;
    }
  </style>