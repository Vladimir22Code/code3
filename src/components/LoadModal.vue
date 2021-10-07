<template>
  <teleport to="body">
    <div class="background">
      <div class="container">
        <div class="gameList">
          <ul>
            <li @click="selected(game)"
            :class="{selected : game.selected}" 
            v-for="game in store.state.savedGames" :key="game.id"> 
            {{ game.setHeader() }} </li>
          </ul>
        </div>
        <div class="buttons">
          <button id="load" @click="store.methods.loadGame">
            <ph-check weight="fill"/> 
            Load</button>
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
  name: 'LoadModal',

  setup() {

    function cancel() {
      store.state.loadModal = false
    }

    function selected(game) {
      store.state.savedGames.forEach(element => {
        element.selected = false
      });
      game.selected = true
      store.state.selectedGame = game
    }

    return {
      store,
      cancel,
      selected
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
    width: 400px;
    height: 500px;
    padding: 10px;
    background-color: var(--light);
    border: 5px solid var(--border);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(12, 1fr);
  }

  .gameList {
    grid-row: 1/12;
    border: 5px solid var(--dark);
    margin-bottom: 10px;
    overflow-y: auto;
  }

  li {
    list-style: none;
    padding: 2px;
    overflow: hidden;
  }

  li:hover {
    cursor: pointer;
  }

  .selected {
    background-color: var(--dark);
    color: var(--light);
  }

  .buttons {
    grid-row: 12/13;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    place-items: center;
  }

  .buttons button {
    width: 80px;
    height: 30px;
  }

  #load {
    background-color: darkgreen;
    color: var(--light);
  }

  #cancel {
    background-color: darkred;
    color: var(--light);
  }

</style>