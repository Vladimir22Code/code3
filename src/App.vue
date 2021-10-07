<template>
  <controls></controls>
  <board></board>
  <notation></notation>
  <promotion-modal v-if="store.state.promotionModal" ></promotion-modal>
  <edit-modal v-if="store.state.editModal"></edit-modal>
  <save-modal v-if="store.state.saveModal"></save-modal>
  <load-modal v-if="store.state.loadModal"></load-modal>
</template>

<script>
import store from '@/store'
import Board from './components/Board.vue'
import Controls from './components/Controls.vue'
import Notation from './components/Notation.vue'
import PromotionModal from './components/PromotionModal.vue'
import EditModal from './components/EditModal.vue'
import SaveModal from './components/SaveModal.vue'
import LoadModal from './components/LoadModal.vue'


export default {
  components: { Board, Controls, Notation, 
  PromotionModal, EditModal, SaveModal, LoadModal },
  name: 'App',

  setup() {
    return {
      store
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root{
  --light: #ffdf91;
  --dark: #865439;
  --border: #402218;
  --background: #d8ba7d;
  --highlight: rgba(0,128,0,0.4)

}

#app {
  display: grid;
  width: 100%;
  height: 100vh;
  background-color: var(--background);
  grid-template-columns: 250px auto 350px;
}
</style>
