<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';

  const { data, form }: { data: PageServerData;form: ActionData } = $props();
</script>

<h1>Settings</h1>

<section>
  <h2>Update username</h2>
  <p>Your username: {data.user.username}</p>
  <form method='post' use:enhance action='?/update_username'>
    <label for='form-username'>New username</label>
    <input type='text' id='form-username' name='username' required />
    <button>Update</button>
    <p>{form?.username?.message ?? ''}</p>
  </form>
</section>

<section>
  <h2>Update email</h2>
  <p>Your email: {data.user.email}</p>
  <form method='post' use:enhance action='?/update_email'>
    <label for='form-email'>New email</label>
    <input type='email' id='form-email' name='email' required />
    <button>Update</button>
    <p>{form?.email?.message ?? ''}</p>
  </form>
</section>

<section>
  <h2>Update password</h2>
  <form method='post' use:enhance action='?/update_password'>
    <label for='form-current-password'>Current password</label>
    <input
      type='password'
      id='form-current-password'
      name='current_password'
      autocomplete='current-password'
      required
    />
    <label for='form-new-password'>New password</label>
    <input
      type='password'
      id='form-new-password'
      name='new_password'
      autocomplete='new-password'
      required
    />
    <button>Update</button>
    <p>{form?.password?.message ?? ''}</p>
  </form>
</section>
