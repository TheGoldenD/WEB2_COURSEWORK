<template>
  <div>
    <h1>Test Page</h1>
  </div>
</template><template>
  <div class="ui container">
    <h2 class="ui header">Vocabulary Test</h2>
    <vocab-test />
  </div>
</template>

<script>
import VocabTest from '../components/VocabTest.vue';

export default {
  name: 'Test',
  components: {
    VocabTest
  }
};
</script>