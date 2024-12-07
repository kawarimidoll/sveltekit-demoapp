<script lang='ts'>
  import type { ActionData, PageServerData } from './$types';
  import { enhance } from '$app/forms';
  import { Input } from '$lib/components';

  const { data, form }: { data: PageServerData;form: ActionData } = $props();
</script>

<div class='mb-4 text-center'>
  <h2>Settings</h2>
</div>

<section class='m-auto w-full sm:max-w-md'>
  <h3>Update username</h3>
  <p>Current username: {data.user.username}</p>
  <form class='space-y-2' method='post' use:enhance action='?/update_username'>
    <Input required type='text' name='username' placeholder='New username' icon='i-octicon-person-16' />
    <button class='w-full btn btn-primary'>Update</button>
    <p>{form?.username?.message ?? ''}</p>
  </form>
</section>

<div class='divider divider-accent'>Important zone</div>

<section class='m-auto w-full sm:max-w-md'>
  <form class='space-y-2' method='post' action='?/request_verify' use:enhance>
    <p>To update below, you need to verify your identity.</p>
    <button class='w-full btn btn-primary'>Send verification code</button>
    <p style='color: red'>{form?.code?.message ?? ''}</p>
  </form>
</section>

<section class='m-auto w-full sm:max-w-md'>
  <h3>Update email</h3>
  <form class='space-y-2' method='post' action='?/update_email' use:enhance>
    <Input required type='email' name='email' placeholder='New email' icon='i-octicon-mail-16' />
    <Input required type='text' name='code' placeholder='Verification code' icon='i-octicon-shield-lock-16' />
    <button class='w-full btn btn-primary'>Update</button>
    <p>{form?.email?.message ?? ''}</p>
  </form>
</section>

<section class='m-auto w-full sm:max-w-md'>
  <h3>Update password</h3>
  <form class='space-y-2' method='post' action='?/update_password' use:enhance>
    <Input required
           placeholder='New password'
           type='password'
           name='new_password'
           autocomplete='new-password'
           icon='i-octicon-key-16' />
    <Input required type='text' name='code' placeholder='Verification code' icon='i-octicon-shield-lock-16' />
    <button class='w-full btn btn-primary'>Update</button>
    <p>{form?.password?.message ?? ''}</p>
  </form>
</section>

<div class='divider divider-error'>Danger zone</div>

<section class='m-auto w-full sm:max-w-md'>

  <h3>Delete account</h3>
  <p>
    Deleting your account will permanently remove all your data from the server.
  </p>
  <form class='space-y-2' method='post' action='?/unregister' use:enhance>
    <label class='cursor-pointer label'>
      <span class='label-text'>Agreement: I understand that this action is irreversible.</span>
      <input type='checkbox' class='checkbox-error checkbox' name='agree' required />
    </label>
    <Input required placeholder='Password' type='password' name='password' icon='i-octicon-key' />
    <Input required type='text' name='code' placeholder='Verification code' icon='i-octicon-shield-lock-16' />
    <button class='w-full btn btn-error'>Delete account</button>
    <p>{form?.delete?.message ?? ''}</p>
  </form>
</section>
