<template>
  <div class="navbar">
    <img src="@/assets/hackernews.png" alt="Logo" class="navbar-logo" />
    <h3>Search Hacker News</h3>
    <ul>
      <li v-for="item in items" :key="item" @click="handleClick(item)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        "All",
        "Hot",
        "Show HN",
        "Ask HN",
        "Polls",
        "Jobs",
        "Shipow",
        "Starred",
      ],
    };
  },
  methods: {
    handleClick(item) {
      // Emit the selected filter to the parent App.vue
      this.$emit("filter-changed", item);
    },
  },
};
</script>

<style scoped>
.navbar {
  width: 200px;
  padding: 10px;
  border-right: 1px solid #ccc;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 10px;
  cursor: pointer;
}
li:hover {
  background-color: #f0f0f0;
}

.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navbar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.navbar-logo {
  width: 40px;
  height: 40px;
}
h3 {
  text-align: center;
}
</style>
