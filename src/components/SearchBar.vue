<template>
  <div class="search-bar">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search posts..."
      @input="onSearch"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    onSearch() {
      this.$emit("search-changed", this.searchQuery);
    },
  },
};
</script>

<style scoped>
.search-bar {
  width: 500px;
  padding: 5px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 50px;
  box-sizing: border-box;
}
</style>
