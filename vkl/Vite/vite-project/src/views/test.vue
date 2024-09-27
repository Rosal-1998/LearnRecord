<script setup>
import { ref } from "vue";
import axios from "axios";
import chartFormat from "../../chartFormat.json";
import populationData from "../../population.json";
import wagesData from "../../wages.json";
const a = {
  name:'11',
  age:'7'
}
console.log('a',a)
const b = structuredClone(a);

console.log('b',b)
const c = structuredClone(a);
console.log('c',c)
c.age = 8
console.log('b',b)
console.log( 'c',c)
</script>


<template>
  <div class="about">
  hi
  </div>
</template>




<style>

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>



