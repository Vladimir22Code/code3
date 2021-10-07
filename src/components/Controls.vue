<template>
  <div class="container">
    <span>Controls</span>
    <button @click="store.methods.startNewGame">Start New Game</button>
    <button :class="{active : store.state.rotateBoard}" @click="store.methods.rotateBoard">Rotate Board</button>
    <button :class="{active : store.state.showCoordinates}" @click="store.methods.showCoordinates">Show Coordinates</button>
    <button :class="{active : store.state.showMoves}" @click="store.methods.showMoves">Show Possible Moves</button>
    <span>Chess Sets</span>
    <div class="chessSets">
      <img @click="store.methods.chessSet1" src="/assets/set1/blackKing.svg">
      <img @click="store.methods.chessSet2" src="/assets/set2/blackKing2.svg">
      <img @click="store.methods.chessSet3" src="/assets/set3/blackKing3.svg">
    </div>
    <span>Color Schemes</span>
    <button :class="{active : defaultIsActive}" @click="setDefault">Default</button>
    <button :class="{active : greenIsActive}" @click="setGreen">Green</button>
    <button :class="{active : blueIsActive}" @click="setBlue">Blue</button>
    <button :class="{active : classicIsActive}" @click="setClassic">Classic</button>
    <span>Side To Move</span>
    <img v-if="store.state.whiteToMove" src="/assets/set1/whitePawn.svg">
    <img v-else src="/assets/set1/blackPawn.svg">
  </div>
</template>

<script>
import store from '@/store'
import { ref } from 'vue'

export default {
  name: 'Controls',

  setup() {

    // active color scheme
    let defaultIsActive = ref(true)
    let greenIsActive = ref(false)
    let blueIsActive = ref(false)
    let classicIsActive = ref(false)

    // setting color schemes
    function setDefault() {
    document.documentElement.style.setProperty('--light', '#ffdf91')
    document.documentElement.style.setProperty('--dark', '#865439')
    document.documentElement.style.setProperty('--border', '#402218')
    document.documentElement.style.setProperty('--background', '#d8ba7d')
    document.documentElement.style.setProperty('--highlight', 'rgba(0,128,0,.5)')
    defaultIsActive.value = true
    greenIsActive.value = false
    blueIsActive.value = false
    classicIsActive.value = false
  }
    function setGreen() {
    document.documentElement.style.setProperty('--light', '#b6eb7a')
    document.documentElement.style.setProperty('--dark', '#61b15a')
    document.documentElement.style.setProperty('--border', '#335d2d')
    document.documentElement.style.setProperty('--background', '#d8ebb5')
    document.documentElement.style.setProperty('--highlight', 'rgba(255,255,0,.3)')
    defaultIsActive.value = false
    greenIsActive.value = true
    blueIsActive.value = false
    classicIsActive.value = false
  }
    function setBlue() {
    document.documentElement.style.setProperty('--light', '#aad8d3')
    document.documentElement.style.setProperty('--dark', '#2978b5')
    document.documentElement.style.setProperty('--border', '#00409a')
    document.documentElement.style.setProperty('--background', '#c1cfe3')
    document.documentElement.style.setProperty('--highlight', 'rgba(0,128,0,.5)')
    defaultIsActive.value = false
    greenIsActive.value = false
    blueIsActive.value = true
    classicIsActive.value = false
  }
    function setClassic() {
    document.documentElement.style.setProperty('--light', '#dddddd')
    document.documentElement.style.setProperty('--dark', '#7e7474')
    document.documentElement.style.setProperty('--border', '#2b2b2b')
    document.documentElement.style.setProperty('--background', '#ededed')
    document.documentElement.style.setProperty('--highlight', 'rgba(0,128,0,.5)')
    defaultIsActive.value = false
    greenIsActive.value = false
    blueIsActive.value = false
    classicIsActive.value = true
  }

    return{
      store,
      setDefault,
      setGreen,
      setBlue,
      setClassic,
      defaultIsActive,
      greenIsActive,
      blueIsActive,
      classicIsActive
    }
  }

}
</script>

<style scoped>
  .container {
    display: grid;
    width: 250px;
    height: 100vh;
    background-color: var(--light);
    grid-template-columns: 1fr;
    grid-template-rows: repeat(14, 1fr);

  }

  button {
    display: inline-block;
    margin: 0 20px 5px;
    color: var(--light);
    background-color: var(--border);
    border: 5px solid var(--dark);
    font-size: 1.1rem;
  }

  button:hover {
    background-color: darkgoldenrod;
    cursor: pointer;
  }

  span {
    display: inline-grid;
    place-items: center;
    color: var(--border);
    font-size: 1.8rem;

  }

  .active {
    border-color: darkgoldenrod;
  }

  img {
    width: 35px;
    place-self: center;
  }

  .chessSets {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .chessSets:hover {
    cursor: pointer;
  }


</style>