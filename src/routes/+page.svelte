<script>
  // data comes from the form action's return (if any)
  export let data;
</script>

<h1>URL Shortener</h1>

<form method="post">
  <label for="url">Enter your URL:</label>
  <input type="url" id="url" name="url" placeholder="https://example.com" required />
  <button type="submit">Shorten</button>
</form>

{#if data && data.shortUrl}
  <p>Your short URL: <a href="{data.shortUrl}">{data.shortUrl}</a></p>
{/if}