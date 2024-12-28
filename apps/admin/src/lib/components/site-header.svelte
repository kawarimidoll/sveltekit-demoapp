<script lang='ts'>
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
</script>

{#snippet link(href: string, text: string)}
  <a
    {href}
    class={cn(
      'hover:text-foreground/80 transition-colors',
      page.url.pathname.startsWith(href) ? 'text-foreground' : 'text-foreground/60',
    )}
  >
    {text}
  </a>
{/snippet}

<header
  class='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
>
  <div class='h-14 max-w-screen-2xl flex items-center px-8'>
    <!-- nav for pc -->
    <div class='mr-4 hidden md:flex'>
      <a href='/' class='mr-6 flex items-center space-x-2'>
        <div class='i-lucide-cat'></div>
        <span class='hidden font-bold xl:inline-block'>
          Admin top
        </span>
      </a>
      <nav class='flex items-center gap-6 text-sm'>
        {@render link('/books', 'Books')}
        {@render link('/admins', 'Admins')}
        {@render link('/users', 'Users')}
        {@render link('/authors', 'Authors')}
        {@render link('/publishers', 'Publishers')}
        {@render link('/genres', 'Genres')}
      </nav>
    </div>

    <!-- Mobile nav here -->

    <div class='flex flex-1 items-center justify-between md:justify-end space-x-2'>
      <div class='w-full flex-1 md:w-auto md:flex-none'>
        <Button
          variant='outline'
          class='relative w-full justify-start text-sm text-muted-foreground lg:w-64 md:w-40 sm:pr-12'
        >
          [WIP] Search
          <!-- <span class='hidden lg:inline-flex'> Search documentation... </span> -->
          <!-- <span class='inline-flex lg:hidden'>Search...</span> -->
          <kbd
            class='pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 border rounded bg-muted px-1.5 text-[10px] font-medium font-mono opacity-100 sm:flex'
          >
            /
          </kbd>
        </Button>
      </div>
      <nav class='flex items-center'>
        <!-- Mode toggle here -->
        <div class='i-lucide-sun-moon'></div>
      </nav>
    </div>
  </div>
</header>
