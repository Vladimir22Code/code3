<template>
  <div class="container">
    <div class="messageBoardContainer">
      <span id="mbHeader">Message Board</span>
      <span id="mbText">{{ store.state.messageBoard}}</span>
    </div>
    <div class="notationContainer">
      <span>White: <span class="plainText">{{ store.state.white }}</span></span><br>
      <span>Black: <span class="plainText">{{ store.state.black }}</span></span><br>
      <span>Result: <span class="plainText">{{ store.state.result }}</span></span><br>
      <span>Date: <span class="plainText">{{ store.state.date }}</span></span><br>
      <span>Site: <span class="plainText">{{ store.state.site }}</span></span><br>
      <span>Event: <span class="plainText">{{ store.state.event }}</span></span><br>
      <span class="plainText">{{ store.state.moves }}</span>
    </div>
    <div class="buttons">
      <button @click="openEdit">
        <ph-pencil size="20px" weight="fill"/>
        Edit
      </button>
      <button @click="openSave">
        <ph-archive size="20px" weight="fill"/>
        Save
      </button>
      <button @click="openLoad">
        <ph-download size="20px" weight="fill"/>
        Load
      </button>
    </div>
    
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'Notation',

  setup() {

    function openEdit() {
      store.state.editModal = true
    }

    function openSave() {
      store.state.saveModal = true
    }

    function openLoad() {
      store.state.loadModal = true
    }

    return {
      store,
      openEdit,
      openSave,
      openLoad
    }
  }
}
</script>

<style scoped>
  .container {
    display: grid;
    width: 350px;
    height: 100vh;
    background-color: var(--light);
    grid-template-areas: 
    'mb'
    'nc'
    'nc'
    'nc'
    'nc'
    'nc'
    'nc'
    'bt';
  }

  .notationContainer {
    padding: 10px;
    grid-area: nc;
    overflow: auto;
  }

  .messageBoardContainer {
    height: 100px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr;
    border: 5px solid var(--border);
    grid-area: mb;
  }

  span {
    display: inline-block;
    color: var(--border);
    font-size: 1.2rem;
    font-weight: 700;
    vertical-align: middle;
    text-align: left;
  }

  #mbHeader {
    display: inline-grid;
    place-items: center;
    color: var(--light);
    background-color: var(--border);
    margin-bottom: 15px;
  }

  #mbText {
    display: inline-grid;
    place-items: center;
    font-weight: normal;
  }

  .plainText {
    font-weight: normal;
  }
  
  .buttons {
    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    place-items: center;
    grid-area: bt;
  }

  .buttons button {
    width: 80px;
    margin: 10px;
    padding: 10px;
    color: var(--light);
    background-color: var(--border);
    border: 5px solid var(--dark);
    font-size: 1.2rem;
  }
  .buttons button:hover {
    cursor: pointer;
    background-color: darkgoldenrod;
  }

</style>