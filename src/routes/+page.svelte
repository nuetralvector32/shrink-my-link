<script>
  export let data;
  let submitting = false;
  let copied = false;
  let url = '';
  
  function handleSubmit() {
    submitting = true;
  }

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

<pre>{JSON.stringify(data, null, 2)}</pre>
<main>
  <div class="container">
    <h1>URL Shortener</h1>
    <p class="subtitle">Create short, memorable links for your long URLs</p>

    <form method="post" on:submit={handleSubmit} class="url-form">
      <div class="input-group">
        <input 
          type="url" 
          id="url" 
          name="url" 
          bind:value={url}
          placeholder="https://example.com" 
          required 
        />
        {#if submitting}
          <button type="submit" disabled class="loading">
            <span class="spinner"></span>
            Shortening...
          </button>
        {:else}
          <button type="submit">Shorten URL</button>
        {/if}
      </div>
    </form>

    {#if data && data.error}
      <div class="error">
        <p>{data.error}</p>
      </div>
    {/if}

    {#if data && data.shortUrl}
      <div class="result">
        <div class="short-url">
          <input 
            type="text" 
            readonly 
            value={data.shortUrl} 
            class="short-url-input"
          />
          <button 
            class="copy-btn" 
            on:click={() => copyToClipboard(data.shortUrl)}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <a href="{data.shortUrl}/stats" class="stats-link">View Statistics</a>
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

  button:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid #ffffff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error {
    background: #fed7d7;
    color: #c53030;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .result {
    background: #ebf8ff;
    padding: 1.5rem;
    border-radius: 6px;
  }

  .short-url {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
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

  .stats-link {
    display: block;
    text-align: center;
    color: #4299e1;
    text-decoration: none;
  }

  .stats-link:hover {
    text-decoration: underline;
  }
</style>