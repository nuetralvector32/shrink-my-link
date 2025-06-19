<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  export let data;
  
  $: base = $page.url.origin;
  $: currentCursor = $page.url.searchParams.get('cursor');

  let prevCursors = [];
  let nextCursor = data.nextCursor;
  let hasMore = data.hasMore;

  function goToNext() {
    if (nextCursor) {
      prevCursors = [...prevCursors, currentCursor];
      goto(`?cursor=${nextCursor}`);
    }
  }

  function goToPrev() {
    if (prevCursors.length > 0) {
      const prev = prevCursors[prevCursors.length - 1];
      prevCursors = prevCursors.slice(0, -1);
      if (prev) {
        goto(`?cursor=${prev}`);
      } else {
        goto(window.location.pathname); // just the path, no query
      }
    }
  }
</script>

<h1>Admin: List of Short Links</h1>

<p>Base URL: {$page.url.origin}</p>

<table>
  <thead>
    <tr>
      <th>Short URL</th>
      <th>Original URL</th>
      <th>Stats</th>
    </tr>
  </thead>
  <tbody>
    {#each data.links as link}
      <tr>
        <td>
          <a href={`/${link.code}`} target="_blank">{base}/{link.code}</a>
        </td>
        <td>
          <a href={link.longUrl} target="_blank">{link.longUrl}</a>
        </td>
        <td>
          <a href={`/${link.code}/stats`} target="_blank">{base}/{link.code}/stats</a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<div style="margin-top: 1rem; display: flex; gap: 1rem;">
  <button on:click={goToPrev} disabled={prevCursors.length === 0}>Previous</button>
  <button on:click={goToNext} disabled={!hasMore}>Next</button>
</div>

<style>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}
th, td {
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  text-align: left;
}
th {
  background: #f1f5f9;
}
a {
  color: #4299e1;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>