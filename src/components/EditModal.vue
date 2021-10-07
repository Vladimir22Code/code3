<template>
  <teleport to="body">
    <form @submit.prevent="closeModal">
      <div class="background">
        <div class="container">
          <section>
            <span>White:</span>
            <input class="input" v-model="store.state.white" type="text">
          </section>
          <section>
            <span>Black:</span>
            <input class="input" v-model="store.state.black" type="text">
          </section>
          <section class>
            <span>Result:</span>
            <div class="radiobuttons">
              <div>
                <input v-model="store.state.result" type="radio" name="No result" value="">
                <label for="No result">&nbsp;No result</label>
              </div>
              <div>
                <input v-model="store.state.result" type="radio" name="1-0" value="1-0">
                <label for="1-0">&nbsp;1-0</label>
              </div>
              <div>
                <input v-model="store.state.result" type="radio" name="1/2" value="1/2">
                <label for="1/2">&nbsp;1/2</label>
              </div>
              <div>
                <input v-model="store.state.result" type="radio" name="0-1" value="0-1">
                <label for="0-1">&nbsp;0-1</label>
              </div>
            </div>
          </section>
          <section>
            <span>Date:</span>
            <input class="input" v-model="store.state.date" type="date">
          </section>
          <section>
            <span>Site:</span>
            <input class="input" v-model="store.state.site" type="text">
          </section>
          <section>
            <span>Event:</span>
            <input class="input" v-model="store.state.event" type="text">
          </section>
          <button>
          <ph-check weight="fill"/>  
          OK</button>
        </div>
      </div>
    </form>
  </teleport>
</template>

<script>
import store from '@/store'

export default {
  name: 'EditModal',

  setup() {

    function closeModal() {
      store.state.editModal = false
    }

    return {
      store,
      closeModal
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
    width: 420px;
    height: 450px;
    background-color: var(--light);
    border: 5px solid var(--border);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(7, 1fr);
  }

  section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    padding: 10px;
  }

  span {
    grid-column: 1/2;
    color: var(--border);
  }

  .input {
    grid-column: 2/6;
    border: 2px solid var(--border);
  }

  .radiobuttons {
    display: grid;
    grid-template-rows: repeat(4, 1fr);
  }

  button {
    width: 80px;
    height: 30px;
    justify-self: center;
    background-color: var(--border);
    color: var(--light);
  }
</style>