<script lang='ts'>
  import { page } from '$app/state';
  import { buttonVariants } from '$lib/components/ui/button';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Sheet from '$lib/components/ui/sheet';
  import { cn } from '$lib/utils';

  const navItems = [
    { href: '/books', title: 'Books' },
    { href: '/admins', title: 'Admins' },
    { href: '/users', title: 'Users' },
    { href: '/authors', title: 'Authors' },
    { href: '/publishers', title: 'Publishers' },
    { href: '/genres', title: 'Genres' },
  ];

  let open = $state(false);
</script>

{#snippet link(href: string, text: string, className = '')}
  <a
    {href}
    class={cn(
      className,
      page.url.pathname.startsWith(href) ? 'text-foreground' : 'text-foreground/60',
    )}
    onclick={() => open = false}
  >
    {text}
  </a>
{/snippet}

<Sheet.Root bind:open>
  <Sheet.Trigger
    class={cn(
      buttonVariants({
        variant: 'ghost',
        class: 'mr-2 px-0 text-base bg-transparent hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden',
      }),
    )}
  >
    <div class='i-lucide-cat h-5 w-5'></div>
    <span class='sr-only'>Toggle Menu</span>
  </Sheet.Trigger>
  <Sheet.Content side='left' class='pr-0'>
    {@render link('/', 'Admin page', 'font-bold')}
    <ScrollArea orientation='both' class='my-4 h-[calc(100vh-8rem)] pb-10 pl-6'>
      <div class='flex flex-col space-y-3'>
        {#each navItems as navItem}
          {#if navItem.href}
            {@render link(navItem.href, navItem.title, 'text-foreground')}
          {/if}
        {/each}
      </div>
    </ScrollArea>
  </Sheet.Content>
</Sheet.Root>
