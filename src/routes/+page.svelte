<script>
  export let form;
  let copied = false;
  $: url = form?.longUrl ?? '';
  $: shortUrl = form?.shortUrl ?? '';
  $: error = form?.error ?? '';


  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => copied = false, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<main>
  <div class="container">
    <h1>URL Shortener</h1>
    <p class="subtitle">Create short links for your long URLs</p>

    <form method="post" class="url-form" novalidate>
      <div class="input-group">
        <input 
          type="url" 
          id="url" 
          name="url" 
          bind:value={url}
          placeholder="https://example.com" 
          required 
        />
        <button type="submit">Shorten URL</button>
      </div>
    </form>

    <!-- Admin Page Button -->
    <div class="admin-link-container">
      <a href="/admin" class="admin-link-btn">Admin Page</a>
    </div>

    <!-- Shortened URL Box -->
    <div class="short-url-box">
      <label>Your shortened URL:</label>
      {#if shortUrl}
        <div class="short-url-row" style="flex-direction: column; align-items: flex-start;">
          <a href={shortUrl} target="_blank" rel="noopener" class="short-url-link">
            {shortUrl}
          </a>
          <div style="display: flex; width: 100%; gap: 0.5rem; margin-top: 0.5rem;">
            <input type="text" readonly value={shortUrl} class="short-url-input" />
            <button class="copy-btn" on:click={() => copyToClipboard(shortUrl)}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      {:else}
        <div class="short-url-row">
          <input type="text" readonly value="" class="short-url-input" placeholder="No link yet" />
        </div>
      {/if}
    </div>

    {#if error}
      <div class="error">
        <p>{error}</p>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: #f5f5f5;
  }

  .container {
    max-width: 600px;
    width: 100%;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin: 0;
    color: #2d3748;
    font-size: 2.5rem;
    text-align: center;
  }

  .subtitle {
    text-align: center;
    color: #718096;
    margin-bottom: 2rem;
  }

  .url-form {
    margin-bottom: 2rem;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
  }

  input[type="url"] {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input[type="url"]:focus {
    outline: none;
    border-color: #4299e1;
  }

  button {
    padding: 0.75rem 1.5rem;
    background: #4299e1;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background: #3182ce;
  }

  .error {
    background: #fed7d7;
    color: #c53030;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .admin-link-container {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }
  .admin-link-btn {
    background: #e2e8f0;
    color: #2d3748;
    padding: 0.5rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }
  .admin-link-btn:hover {
    background: #cbd5e1;
  }

  .short-url-box {
    margin-top: 2rem;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    max-width: 100%;
  }
  .short-url-box label {
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
    display: block;
  }
  .short-url-row {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .short-url-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #bee3f8;
    border-radius: 6px;
    background: white;
    font-size: 1rem;
  }
  .copy-btn {
    white-space: nowrap;
  }

  .short-url-link {
    color: #4299e1;
    text-decoration: underline;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    word-break: break-all;
  }
  .short-url-link:hover {
    color: #3182ce;
  }
</style>