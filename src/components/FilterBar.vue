<template>
  <div class="filter-bar">
    <!-- Display the selected item text from Navbar -->
    <span class="selected-item-text">{{ selectedItem }}</span>

    <!-- Item Type Dropdown -->
    <label for="itemType">in</label>
    <select v-model="selectedItemType" @change="applyFilters">
      <option v-for="item in itemTypes" :key="item" :value="item">
        {{ item }}
      </option>
    </select>

    <!-- Sort By Dropdown -->
    <label for="sortBy">by:</label>
    <select v-model="selectedSortBy" @change="applyFilters">
      <option
        v-for="sortOption in sortByOptions"
        :key="sortOption"
        :value="sortOption"
      >
        {{ sortOption }}
      </option>
    </select>

    <!-- Time Range Dropdown -->
    <label for="timeRange">for</label>
    <select v-model="selectedTimeRange" @change="applyFilters">
      <option v-for="time in timeRanges" :key="time" :value="time">
        {{ time }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    selectedItem: {
      type: String,
      default: "Stories",
    },
  },
  data() {
    return {
      selectedItemType: "Stories",
      selectedSortBy: "Popularity",
      selectedTimeRange: "All time",
      itemTypes: ["Stories", "Comments", "Jobs", "Ask HNs", "Polls"],
      sortByOptions: ["Popularity", "Date"],
      timeRanges: ["All time", "Past 24 hours", "Past week", "Past month"],
    };
  },
  methods: {
    applyFilters() {
      this.$emit("filtersUpdated", {
        itemType: this.selectedItemType,
        sortBy: this.selectedSortBy,
        timeRange: this.selectedTimeRange,
      });
    },
  },
};
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-item-text {
  font-weight: bold;
  margin-left: 10px;
}
</style>
