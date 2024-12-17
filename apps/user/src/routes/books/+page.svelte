<script lang='ts'>
  import type { PageServerData } from './$types';
  import { Tab } from '$lib/components';
  import { Input } from '@shared/components';
  import { format } from '@std/datetime';

  const { data }: { data: PageServerData } = $props();

  const tabs = [
    { label: 'Book title', value: 'title' },
    { label: 'Author name', value: 'author' },
    { label: 'Publisher name', value: 'publisher' },
  ];
</script>

<section class='m-auto w-full'>
  <div class='mb-4 mt-8 flex'>
    <h2 class='my-0 mr-8 block'>Books</h2>
  </div>

  <form class='space-y-2' method='get' action='?'>
    <Tab name='target' {tabs} initialChecked={data.target} required />
    <Input type='search' name='search' placeholder='Search' bind:value={data.search} required />
    <button class='btn btn-primary'>Search</button>
  </form>

  <div class='text-sm'>Total: {data.count}</div>

  {#each data.books as book}
    <h3>{book.title}</h3>
    {#each book.bookAuthors as bookAuthor}
      <p>{bookAuthor.author?.name || 'no name'}</p>
    {/each}
    <p>{book.publisher?.name || 'no publisher'}</p>
    <p>{format(book.publishDate, 'yyyy-MM-dd')}</p>
  {/each}
</section>
