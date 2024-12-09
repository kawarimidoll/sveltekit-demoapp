<script lang='ts'>
  const { title, thead, tbody } = $props();
</script>

<div class='mb-4'>
  <h2>{title}</h2>
</div>
<div class='overflow-x-auto'>
  <table class='table divide-y divide-gray-200 dark:divide-neutral-700'>
    <thead class=''>
      {@render thead()}
    </thead>
    <tbody class='divide-y divide-gray-200 dark:divide-neutral-700'>
      {@render tbody()}
    </tbody>
  </table>
</div>
