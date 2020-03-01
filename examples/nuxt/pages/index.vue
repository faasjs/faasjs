<template>
  <div class="container">
    <div>
      <h1 class="title">
        FaasJS
      </h1>
      <h2 class="subtitle">
        A FaasJS Demo
      </h2>
      <div class="links">
        <a
          v-for="(link, index) in links"
          :key="index"
          :href="link.href"
          target="_blank"
          class="button--green"
        >
          {{ link.text }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      links: []
    };
  },
  mounted () {
    this.$faas('links').then(({ data }) => this.$set(this, 'links', data));
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.links a {
  margin: 0 10px;
}
</style>
