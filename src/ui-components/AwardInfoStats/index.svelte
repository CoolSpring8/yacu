<script>
  export let stats;
</script>

<div class="award-info-stats">
  <p>统计：</p>
  {#each stats as info}
    <p class="item">{info[0]}×{info[1]}；</p>
  {/each}
</div>

<style>
  .award-info-stats {
    display: flex;
    gap: 2px;
    font-size: 12px;
  }
  .item {
    color: grey;
    margin-right: 4px;
  }
</style>
