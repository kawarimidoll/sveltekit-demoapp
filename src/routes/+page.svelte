<script lang='ts'>
  import type { PageServerData } from './$types';
  import { enhance } from '$app/forms';

  const { data }: { data: PageServerData } = $props();

  import * as m from '$lib/paraglide/messages.js';
</script>

{#if data?.user == null}
  <!-- https://daisyui.com/components/hero/ -->
  <div
    class='min-h-screen hero'
    style='background-image: url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp);'>
    <div class='bg-opacity-60 hero-overlay'></div>
    <div class='text-center text-neutral-content hero-content'>
      <div class='max-w-md'>
        <h1 class='mb-5 text-5xl font-bold'>Hello there</h1>
        <p class='mb-5'>
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
          quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
        <p><a class='btn btn-primary' href='/login'>{m.login()}</a></p>
      </div>
    </div>
  </div>
{:else}
  <h1>{m.welcome({ name: data.user.username })}</h1>
  <p>{m.yourId({ id: data.user.id })}</p>
  <form method='post' action='?/logout' use:enhance>
    <button>{m.logout()}</button>
  </form>
{/if}

<!-- https://daisyui.com/components/footer/ -->
<footer class='bg-neutral p-10 text-neutral-content footer'>
  <nav>
    <h6 class='footer-title'>Services</h6>
    <a href='/404' class='link link-hover'>Branding</a>
    <a href='/404' class='link link-hover'>Design</a>
    <a href='/404' class='link link-hover'>Marketing</a>
    <a href='/404' class='link link-hover'>Advertisement</a>
  </nav>
  <nav>
    <h6 class='footer-title'>Company</h6>
    <a href='/404' class='link link-hover'>About us</a>
    <a href='/404' class='link link-hover'>Contact</a>
    <a href='/404' class='link link-hover'>Jobs</a>
    <a href='/404' class='link link-hover'>Press kit</a>
  </nav>
  <nav>
    <h6 class='footer-title'>Legal</h6>
    <a href='/404' class='link link-hover'>Terms of use</a>
    <a href='/404' class='link link-hover'>Privacy policy</a>
    <a href='/404' class='link link-hover'>Cookie policy</a>
  </nav>
</footer>
