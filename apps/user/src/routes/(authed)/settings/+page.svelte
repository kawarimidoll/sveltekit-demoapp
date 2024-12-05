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
    <label>
      New username
      <input type='text' name='username' required />
    </label>
    <button>Update</button>
    <p>{form?.username?.message ?? ''}</p>
  </form>
</section>

<section>
  <h2>Update email</h2>
  <p>Your email: {data.user.email}</p>
  <form method='post' action='?/request_verify' use:enhance>
    <input type='hidden' name='target' value='email' />
    <button>Send verification code</button>
  </form>
  <form method='post' use:enhance action='?/update_email'>
    <label>
      New email
      <input type='email' name='email' required />
    </label>
    <label>
      Verification code
      <input type='text' name='code' required />
    </label>
    <button>Update</button>
    <p>{form?.email?.message ?? ''}</p>
  </form>
</section>

<section>
  <h2>Update password</h2>
  <form method='post' action='?/request_verify' use:enhance>
    <input type='hidden' name='target' value='password' />
    <button>Send verification code</button>
  </form>
  <form method='post' use:enhance action='?/update_password'>
    <label>
      Current password
      <input
        type='password'
        name='current_password'
        autocomplete='current-password'
        required
      />
    </label>
    <label>
      New password
      <input
        type='password'
        name='new_password'
        autocomplete='new-password'
        required
      />
    </label>
    <label>
      Verification code
      <input type='text' name='code' required />
    </label>
    <button>Update</button>
    <p>{form?.password?.message ?? ''}</p>
  </form>
</section>

<hr>
<a href='/unregister'>Delete account</a>
