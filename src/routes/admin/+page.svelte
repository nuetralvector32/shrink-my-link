<script>
  export let data;
  let base = '';
  if (typeof window !== 'undefined') {
    base = window.location.origin;
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