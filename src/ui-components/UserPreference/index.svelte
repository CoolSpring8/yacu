<script>
  import UserPreferenceModal from "./modal.svelte";

  let open = false;
</script>

<button class="user-preference-button" on:click={() => (open = true)}>
  偏好设置
</button>

{#if open}
  <UserPreferenceModal bind:open />
{/if}

<style>
  .user-preference-button {
    position: fixed;
    right: 30px;
    top: 80px;
    z-index: 2;
    background-color: white;
  }
</style>
