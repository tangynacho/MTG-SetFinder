<script setup>
import DecklistInput from './components/decklist-input.vue';
import SetResults from './components/set-results.vue';
import { ref } from 'vue';

const submitted = ref(false)
const decklist = ref('')
const collection = ref([])

function findSets(d) {
    decklist.value = d.list
    collection.value = d.collection
    submitted.value = true
}

function goBack() {
    submitted.value = false
}

</script>

<template>
    <div id="container">
        <decklist-input v-if="!submitted" :decklist="decklist" :collection="collection" @submit="findSets" />
        <set-results v-else :decklist="decklist" :collection="collection" @back="goBack" />
    </div>
</template>

<style>
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}

#app {
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
}
#container {
    background-color: #333;
    min-height: 100vh;
}
#title {
    text-align: center;
    font-size: min(12vw, 5vh);
    color: white;
}
.white-text {
    color: white;
}
.no-uppercase {
     text-transform: unset !important;
}
.fix-width {
    width: 100%;
}
</style>