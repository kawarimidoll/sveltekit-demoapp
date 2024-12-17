<script lang='ts'>
  import type { PageServerData } from './$types';
  import { Input } from '@shared/components';
  import { format } from '@std/datetime';

  const { data }: { data: PageServerData } = $props();
</script>

<section class='m-auto w-full'>
  <div class='mb-4 mt-8 flex'>
    <h2 class='my-0 mr-8 block'>Books</h2>
  </div>

  <form class='space-y-2' method='get' action='?'>
    <Input type='search' name='search' placeholder='Search' bind:value={data.search} required />
    <button class='btn btn-primary'>Search</button>
  </form>

  <div class='text-sm'>Total: {data.count}</div>

  {#each data.books as book}
    <h3>{book.title}</h3>
    {#each book.authors as author}
      <p>{author.name}</p>
    {/each}
    <p>{book.publisher?.name || 'no publisher'}</p>
    <p>{format(book.publishDate, 'yyyy-MM-dd')}</p>
  {/each}
</section>
