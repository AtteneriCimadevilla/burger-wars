<script>
import { RouterView } from 'vue-router';
import HeaderView from './views/HeaderView.vue'
import FooterView from './views/FooterView.vue'

export default {
  components: {
    HeaderView,
    FooterView,
  }
}
</script>

<template>
  <div>
    <HeaderView />
    <div class="main">
      <RouterView />
    </div>
    <FooterView />
  </div>
</template>

<style scoped>
.main {
  height: 73vh;
  overflow-y: scroll;
}
</style>