<script lang="ts">
	import { page } from '$app/state';

	let user = $derived(page.data.user ?? null);
</script>

<h1 style:view-transition-name="main-heading">About</h1>
<p class="center">
	This unbelievably awesome website is built with SvelteKit, Tailwind CSS, and Better Auth.
</p>
<p class="center">
	Gaze upon our <a href="/blog/posts">Blog Posts</a>, {#if user}{user.name}.<br /> Or {#if user.role === 'admin'}ban
			some users with your <a href="/admin">Admin</a> powers.{:else}
			Guest.<br /> Or <a href="/sign-up">Sign Up</a> and <a href="/login">Login</a>
		{/if}
	{/if}
</p>

<style>
	.center {
		text-align: center;
	}
</style>
