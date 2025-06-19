<script>
  import { page } from '$app/stores';
  export let data;

  $: currentCursor = $page.url.searchParams.get('cursor');
  let prevCursors = [];

  function goToNext() {
    if (data.nextCursor) {
      prevCursors = [...prevCursors, currentCursor];
      // Use SvelteKit's goto for navigation
      import('$app/navigation').then(({ goto }) => {
        goto(`?cursor=${data.nextCursor}`);
      });
    }
  }

  function goToPrev() {
    if (prevCursors.length > 0) {
      const prev = prevCursors[prevCursors.length - 1];
      prevCursors = prevCursors.slice(0, -1);
      import('$app/navigation').then(({ goto }) => {
        if (prev) {
          goto(`?cursor=${prev}`);
        } else {
          goto(window.location.pathname);
        }
      });
    }
  }
</script>

<h1>Stats for {data.slug}</h1>

{#if data.metadata}
  <p>Original URL: <a href="{data.metadata.longUrl}" target="_blank">{data.metadata.longUrl}</a></p>
  <p>Created at: {new Date(data.metadata.createdAt).toLocaleString()}</p>
  <p>Total clicks: {data.metadata.clickCount}</p>
  <h2>Click Timestamps</h2>
  <ul>
    {#each data.clicks as click}
      <li>{new Date(click).toLocaleString()}</li>
    {/each}
  </ul>
{:else}
  <p>No data available.</p>
{/if}

<div style="margin-top: 1rem; display: flex; gap: 1rem;">
  <button on:click={goToPrev} disabled={prevCursors.length === 0}>Previous</button>
  <button on:click={goToNext} disabled={!data.hasMore}>Next</button>
</div>