<template>
  <div class="app-container">
    <NavbarComponent @filter-changed="updateFilter" />
    <div class="main-content">
      <SearchBar @search-changed="onSearchChanged" />

      <!-- Pass the selected filters as props to PostList -->
      <FilterBar :selectedItem="currentFilter" />

      <!-- Pass selected filters down to PostList -->
      <PostList
        :category="currentFilter"
        :searchQuery="searchQuery"
        :selectedItemType="selectedItemType"
        :selectedSortBy="selectedSortBy"
        :selectedTimeRange="selectedTimeRange"
      />
    </div>
  </div>
</template>

<script>
import FilterBar from "./components/FilterBar.vue";
import PostList from "./components/PostList.vue";
import NavbarComponent from "./components/NavbarComponent.vue";
import SearchBar from "./components/SearchBar.vue";

export default {
  components: {
    FilterBar,
    PostList,
    NavbarComponent,
    SearchBar,
  },
  data() {
    return {
      currentFilter: "All",
      searchQuery: "",
      selectedItemType: "Stories",
      selectedSortBy: "Popularity",
      selectedTimeRange: "All time",
    };
  },
  methods: {
    updateFilter(item) {
      this.currentFilter = item;
    },
    onSearchChanged(query) {
      this.searchQuery = query;
    },
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.navbar {
  width: 200px;
}

.search-bar,
.filter-bar {
  padding: 10px;
}

.filter-bar {
  margin-top: 10px;
}
</style>
