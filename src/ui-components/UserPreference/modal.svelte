<script>
  import { get, set } from "idb-keyval";
  import { onMount } from "svelte";

  export let open;

  let blockedUsers;

  onMount(async () => {
    blockedUsers = [...(await get("blocked-users"))]?.join(" ") || "";
  });
</script>

<div
  class="user-preference-modal bg-gray-100 shadow-2xl rounded-lg"
  class:hidden={!open}
>
  <div class="flex justify-between items-center">
    <h2>偏好设置</h2>
    <div class="text-3xl cursor-pointer" on:click={() => (open = false)}>×</div>
  </div>
  <div class="user-preference-items">
    <div class="block-users">
      <h3>屏蔽用户发言</h3>
      <div class="flex gap-2">
        <input type="text" bind:value={blockedUsers} />
        <button
          on:click={() => {
            set("blocked-users", new Set(blockedUsers.split(" ")));
          }}
        >
          保存
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .user-preference-modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 400px;
    height: 300px;
    background-color: whitesmoke;
    padding: 40px;
  }
</style>
