<script>
  export let data;
</script>

<h1>Stats for {data.slug}</h1>

{#if data.metadata}
  <p>Original URL: <a href="{data.metadata.longUrl}" target="_blank">{data.metadata.longUrl}</a></p>
  <p>Created at: {new Date(data.metadata.createdAt).toLocaleString()}</p>
  <p>Total clicks: {data.metadata.clickCount}</p>
  <h2>Click Timestamps</h2>
  <ul>
    {#each data.metadata.clicks as click}
      <li>{new Date(click).toLocaleString()}</li>
    {/each}
  </ul>
{:else}
  <p>No data available.</p>
{/if}