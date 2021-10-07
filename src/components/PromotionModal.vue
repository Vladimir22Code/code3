<template>
  <teleport to="body">
    <div class="background">
      <div class="container">
        <div @click="store.methods.promotePiece('Q')" class="button">
          <img v-if="store.state.pieceToPlay.color === 'white'" src="/assets/set1/whiteQueen.svg">
          <img v-else src="/assets/set1/blackQueen.svg">
        </div>
        <div @click="store.methods.promotePiece('R')" class="button">
          <img v-if="store.state.pieceToPlay.color === 'white'" src="/assets/set1/whiteRook.svg">
          <img v-else src="/assets/set1/blackRook.svg">
        </div>
        <div @click="store.methods.promotePiece('B')" class="button">
          <img v-if="store.state.pieceToPlay.color === 'white'" src="/assets/set1/whiteBishop.svg">
          <img v-else src="/assets/set1/blackBishop.svg">
        </div>
        <div @click="store.methods.promotePiece('N')" class="button">
          <img v-if="store.state.pieceToPlay.color === 'white'" src="/assets/set1/whiteKnight.svg">
          <img v-else src="/assets/set1/blackKnight.svg">
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import store from '@/store'

export default {
  name: 'PromotionModal',

  setup() {

    return {
      store
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
    width: 320px;
    height: 90px;
    background-color: var(--light);
    border: 5px solid var(--border);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    place-items: center;
  }

  .button {
    width: 60px;
    height: 60px;
    border: 5px solid var(--dark);
    display: inline-grid;
    place-items: center;
  }

  .button:hover {
    cursor: pointer;
  }

  img {
    width: 40px;
    height: 40px;
  }
</style>