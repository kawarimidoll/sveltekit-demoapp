<script lang='ts'>
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  const { form }: { form: ActionData } = $props();
</script>

<h1>Delete account</h1>

<p>
  Deleting your account will permanently remove all your data from the server.
  <br>
  To delete your account, you need to verify your email and enter your password.
</p>

<section>
  <form method='post' action='?/request_verify' use:enhance>
    <input type='hidden' name='target' value='email' />
    <button>Send verification code</button>
  </form>
  <form method='post' action='?/unregister' use:enhance>
    <label>
      <input type='checkbox' name='agree' required />
      I understand that this action is irreversible.
    </label>
    <label>
      Verification code
      <input type='text' name='code' required />
    </label>
    <label>
      Password
      <input type='password' name='password' required />
    </label>
    <button>Delete</button>
    <p>{form?.message ?? ''}</p>
  </form>
</section>
