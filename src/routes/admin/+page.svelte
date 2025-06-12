<script>
  export let data;
  let base = '';
  if (typeof window !== 'undefined') {
    base = window.location.origin;
  }

  // Pagination state
  let prevCursors = [];
  let currentCursor = null;
  let nextCursor = data.nextCursor;
  let hasMore = data.hasMore;

  // On mount, get cursor from URL
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    currentCursor = params.get('cursor');
  }

  function goToNext() {
    if (nextCursor) {
      prevCursors = [...prevCursors, currentCursor];
      window.location.search = `?cursor=${nextCursor}`;
    }
  }

  function goToPrev() {
    if (prevCursors.length > 0) {
      const prev = prevCursors[prevCursors.length - 1];
      prevCursors = prevCursors.slice(0, -1);
      if (prev) {
        window.location.search = `?cursor=${prev}`;
      } else {
        window.location.search = '';
      }
    }
  }
</script>

<h1>Admin: List of Short Links</h1>

<table>
  <thead>
    <tr>
      <th>Short URL</th>
      <th>Original URL</th>
      <th>Click Count</th>
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
        <td>{link.clickCount}</td>
        <td><a href={`/${link.code}/stats`} target="_blank">View Stats</a></td>
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