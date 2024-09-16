<script>
    export let url = '';
    export let size = '24px';
    export let alt = 'Icon';
  </script>
  
  <img src={url} {alt} style="width: {size}; height: {size};" />
  
  <style>
        img {
        display: inline-block;
        vertical-align: middle;
        }
  </style>