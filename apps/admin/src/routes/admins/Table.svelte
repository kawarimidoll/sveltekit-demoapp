<script lang='ts'>
  import { page } from '$app/stores';

  const { tbody, headers } = $props();

  function sort(name: string) {
    const url = new URL($page.url);
    // none -> asc -> desc
    if (url.searchParams.has('sort', name)) {
      if (!url.searchParams.has('order')) {
        url.searchParams.set('order', 'asc');
      }
      else if (url.searchParams.get('order') === 'asc') {
        url.searchParams.set('order', 'desc');
      }
      else {
        url.searchParams.delete('sort');
        url.searchParams.delete('order');
      }
    }
    else {
      url.searchParams.set('sort', name);
      url.searchParams.set('order', 'asc');
    }
    return url.toString();
  }

  function orderIconClass(name: string) {
    if ($page.url.searchParams.has('sort', name)) {
      if ($page.url.searchParams.get('order') === 'desc') {
        return 'i-octicon-arrow-down-16 inline-block';
      }
      else {
        return 'i-octicon-arrow-up-16 inline-block';
      }
    }
    return 'i-octicon-arrow-both-16 inline-block rotate-90';
  }
</script>

<div class='overflow-x-auto'>
  <table class='table divide-y divide-gray-200 dark:divide-neutral-700'>
    <thead class=''>
      <tr>
        {#each headers as header}
          <th>
            {#if header.sort}
              <a href={sort(header.sort)} class='not-prose block h-full w-full' data-sveltekit-preload-data='tap'>
                {header.display}
                <div class={orderIconClass(header.sort)}></div>
              </a>
            {:else}
              {header.display}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class='divide-y divide-gray-200 dark:divide-neutral-700'>
      {@render tbody()}
    </tbody>
  </table>
</div>
