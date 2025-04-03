<script>
  export let data;
</script>

<h1>Admin: List of Short Links</h1>

<table>
  <thead>
    <tr>
      <th>Short Code</th>
      <th>Original URL</th>
      <th>Click Count</th>
      <th>Stats</th>
    </tr>
  </thead>
  <tbody>
    {#each data.links as link}
      <tr>
        <td>{link.code}</td>
        <td><a href="{link.longUrl}" target="_blank">{link.longUrl}</a></td>
        <td>{link.clickCount}</td>
        <td><a href="/{link.code}/stats">View Stats</a></td>
      </tr>
    {/each}
  </tbody>
</table>