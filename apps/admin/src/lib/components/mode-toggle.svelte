<script lang='ts'>
  import { buttonVariants } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { cn } from '$lib/utils.js';
  import { resetMode, setMode } from 'mode-watcher';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'ghost', class: 'w-9 px-0' }))}>
    <div
      class='i-lucide-sun dark:-roate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0'
    ></div>
    <div
      class='i-lucide-moon absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
    ></div>
    <span class='sr-only'>Toggle theme</span>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align='end'>
    <DropdownMenu.Item onclick={() => setMode('light')}>Light</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => setMode('dark')}>Dark</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
