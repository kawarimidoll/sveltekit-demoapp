<script lang='ts'>
  // https://daisyui.com/components/input/#text-input-with-icon-inside
  import * as m from '$lib/paraglide/messages.js';
</script>
<div
  class='min-h-screen bg-fixed hero'
  style='background-image: url(https://images.unsplash.com/photo-1554896485-c6d2cc4111a8?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);'>
  <div class='bg-opacity-60 hero-overlay'></div>
  <div class='text-neutral-content text-center hero-content'>
    <div class='max-w-md'>
      <h1 class='mb-5 text-5xl font-bold'>{m.heroTitle()}</h1>
      <p class='mb-5'>{m.heroDescription()}</p>
      <a href='/search' class='btn btn-primary'>Find books</a>
      <a href='/login' class='btn btn-primary'>Log in</a>
    </div>
  </div>
</div>

<p class='text-right'>photo: unsplash.com</p>
