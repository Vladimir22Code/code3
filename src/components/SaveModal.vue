<template>
  <teleport to="body">
    <div class="background">
      <div class="container">
        <span id="header">Save current game?</span><br/>
        <span>White: {{ store.state.white }} </span><br/>
        <span>Black: {{ store.state.black }} </span><br/>
        <span>Result: {{ store.state.result}} </span><br/>
        <span>Date: {{ store.state.date }} </span><br/>
        <span>Site: {{ store.state.site }} </span><br/>
        <span>Event: {{ store.state.event }} </span><br/>
        <div class="buttons">
          <button id="save" @click="store.methods.saveGame">
            <ph-check weight="fill"/> 
            Save</button>
          <button id="cancel" @click="cancel">
            <ph-x-circle weight="fill"/>
            Cancel</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import store from '@/store'

export default {
  name: 'SaveModal',
  
  setup() {

    function cancel() {
      store.state.saveModal = false
    }

    return {
      store,
      cancel
    }
  }
}
</script>

<style scoped>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    display: grid;
    place-items: center;
  }

  .container {
    width: 300px;
    height: 320px;
    padding: 10px;
    background-color: var(--light);
    border: 5px solid var(--border);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 1fr);
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    place-items: center;
  }

  #header {
    font-weight: 700;
    justify-self: center;
  }

  .buttons button {
    width: 80px;
    height: 30px;
  }

  #save {
    background-color: darkgreen;
    color: var(--light);
  }

  #cancel {
    background-color: darkred;
    color: var(--light);
  }
</style>