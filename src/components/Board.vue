<template>
  <div class="container">
    <div class="boardContainer" :class="{rotate : store.state.rotateBoard}">
      <div class="vc-container"
      :class=" {adjustForRotationV : store.state.rotateBoard}"
      v-if="store.state.showCoordinates">
        <div class="coordinates" 
        v-for="number in store.state.verticalCoordinates" 
        :key="number.id">
        {{ number.id }}</div>
      </div>
      <div class="hc-container" 
      :class="{adjustForRotationH : store.state.rotateBoard}"
      v-if="store.state.showCoordinates">
        <div class="coordinates" 
        v-for="letter in store.state.horizontalCoordinates" 
        :key="letter.id">
        {{ letter.id }}</div>
      </div>
      <div class="field" v-for="field in store.state.board" :key="field.id"
      :class="field.color"
      @click="store.methods.playMove(field)">
        <div class="highlightOff"
        :class="{highlightOn : field.highlight && store.state.showMoves}">
          <div class="selectedOff"
          :class="{selectedOn : field.selected}">
            <img :class="{rotate : store.state.rotateBoard}" 
            v-if="field.display" 
            :src="field.display.image">
          </div>
        </div>
      </div>
    </div>
    <div class="controlButtons">
      <ph-skip-back 
      @click="store.methods.skipToStart()"
      size="40px" weight="fill" color="var(--border)"/>
      <ph-arrow-fat-left 
      @click="store.methods.oneMoveBack()"
      size="40px" weight="fill" color="var(--border)"/>
      <ph-arrow-counter-clockwise
      @click="store.methods.undoMove()"
      size="40px" weight="fill" color="var(--border)"/>
      <ph-arrow-fat-right 
      @click="store.methods.oneMoveForward()"
      size="40px" weight="fill" color="var(--border)"/>
      <ph-skip-forward 
      @click="store.methods.skipToEnd()"
      size="40px" weight="fill" color="var(--border)"/>
    </div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'Board',

  setup() {

    return {
      store
    }
  }
 
}
</script>

<style scoped>
.container {
  display: grid;
  grid-auto-flow: row;
}

.controlButtons {
  position: absolute;
  top: 600px;
  display: grid;
  width: 500px;
  grid-template-columns: repeat(5, 1fr);
  place-self: center;
  place-items: center;
}

.controlButtons:hover {
  cursor: pointer;
}

.boardContainer {
  position: relative;
  width: 500px;
  height: 500px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  border: 10px solid var(--border);
  justify-self: center;
  margin-top: 50px;
}

.field {
  display: grid;
  width: 60px;
  height: 60px;
}

.light {
  background-color: var(--light);
  z-index: 0;
}

.dark {
  background-color: var(--dark);
  z-index: 0;
}

img {
  place-self: center;
  width: 48px;
  height: 48px;
  z-index: 3;
}

.rotate {
  transform: rotate(180deg);
}

.vc-container {
  position: absolute;
  left: -40px;
  width: 20px;
  height: 480px;
  display: grid;
  grid-template-columns: 1f;
  grid-template-rows: repeat(8, 1fr);
  place-items: center;
}

.hc-container {
  position: absolute;
  bottom: -40px;
  width: 480px;
  height: 20px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: 1fr;
  place-items: center;
}

.coordinates {
  font-size: 1.5rem;
  color: var(--border);
}

/* adjust for board rotation */
.adjustForRotationH {
  transform: rotate(180deg) translate(0, 540px);
}

.adjustForRotationV {
  transform: rotate(180deg) translate(-540px, 0);
}

.highlightOff{
  display: grid;
  width: 60px;
  height: 60px;
  z-index: 1;
}

.highlightOn{
  display: grid;
  width: 60px;
  height: 60px;
  background-color: var(--highlight);
  z-index: 1;
}

.selectedOff {
  display: grid;
  width: 60px;
  height: 60px;
  z-index: 2;
}

.selectedOn {
  display: grid;
  width: 60px;
  height: 60px;
  border: 4px solid darkred;
  z-index: 2;
}

</style>