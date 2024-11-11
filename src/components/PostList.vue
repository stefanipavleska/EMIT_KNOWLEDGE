<template>
  <div class="post-list">
    <div v-for="post in filteredPosts" :key="post.id" class="post">
      <div class="post-content">
        <!-- Title of the post -->
        <h3>
          <a :href="post.url" target="_blank" rel="noopener noreferrer">
            {{ post.title }}
          </a>
        </h3>

        <!-- Author, Points, and Time -->
        <div class="post-meta">
          <span class="points">{{ post.score }} points</span> |
          <span class="author">by {{ post.by }}</span> |
          <span class="time">{{ post.time }}</span>
        </div>

        <!-- Comment Icon -->
        <button @click="toggleComments(post)" class="comment-button">
          <i class="fa fa-comments"></i>
          <span v-if="post.commentIds && post.commentIds.length > 0">
            {{ post.commentIds.length }}
          </span>
          <span v-else>No comments</span>
        </button>

        <!-- Share icon -->
        <button class="icon-button">
          <i class="fa fa-share"></i>
        </button>

        <!-- Star icon -->
        <button class="icon-button">
          <i class="fa fa-star"></i>
        </button>
      </div>

      <!-- Selected post's comments -->
      <div v-if="post.showComments" class="post-comments">
        <h4>Comments</h4>
        <div v-if="post.commentsList && post.commentsList.length">
          <div
            v-for="comment in post.commentsList"
            :key="comment.id"
            class="comment"
          >
            <p v-html="decodeHtmlEntities(comment.text)"></p>
            <p>by {{ comment.by }} | {{ comment.time }}</p>
          </div>
        </div>
        <div v-else>
          <p>No comments available.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    category: String, // Selected category from Navbar
    searchQuery: String, // Search query from SearchBar component
  },
  data() {
    return {
      posts: [], // This will store the fetched posts
    };
  },
  computed: {
    filteredPosts() {
      let filtered = this.posts;

      // Search filter
      if (this.searchQuery) {
        const searchQueryLower = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQueryLower) ||
            post.by.toLowerCase().includes(searchQueryLower)
        );
      }

      return filtered;
    },
  },
  watch: {
    category: "fetchPosts", // Fetch posts again when the category changes
  },
  methods: {
    async fetchPosts() {
      try {
        const apiUrls = {
          All: "https://hacker-news.firebaseio.com/v0/topstories.json",
          Hot: "https://hacker-news.firebaseio.com/v0/beststories.json",
          "Show HN": "https://hacker-news.firebaseio.com/v0/showstories.json",
          "Ask HN": "https://hacker-news.firebaseio.com/v0/askstories.json",
          Jobs: "https://hacker-news.firebaseio.com/v0/jobstories.json",
        };

        const apiUrl = apiUrls[this.category] || apiUrls["All"];
        const response = await fetch(apiUrl);
        const postIds = await response.json();

        this.posts = await Promise.all(
          postIds.slice(0, 10).map(async (id) => {
            const postResponse = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            );
            const post = await postResponse.json();
            return {
              id: post.id,
              title: post.title,
              score: post.score || 0,
              by: post.by || "unknown",
              time: this.getRelativeTime(post.time * 1000),
              url: post.url,
              type: post.type || "story",
              commentIds: post.kids || [], // Store comment IDs
              showComments: false, // Add a field to track comment visibility
            };
          })
        );
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    },

    getRelativeTime(timestamp) {
      const now = new Date();
      const postTime = new Date(timestamp);
      const diffInSeconds = Math.floor((now - postTime) / 1000);

      const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
      ];

      for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
          return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
      }
      return "just now";
    },

    async toggleComments(post) {
      // Toggle visibility of comments for the selected post
      post.showComments = !post.showComments;

      if (post.showComments && !post.commentsList) {
        // Fetch comments only if they haven't been fetched yet
        await this.fetchComments(post);
      }
    },

    async fetchComments(post) {
      if (post.commentIds.length > 0) {
        const commentsList = await Promise.all(
          post.commentIds.map(async (id) => {
            const commentResponse = await fetch(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            );
            const comment = await commentResponse.json();
            return {
              id: comment.id,
              text: this.decodeHtmlEntities(comment.text || ""),
              by: comment.by,
              time: this.getRelativeTime(comment.time * 1000),
            };
          })
        );
        post.commentsList = commentsList;
      }
    },
    // Function to decode HTML entities
    decodeHtmlEntities(text) {
      const textArea = document.createElement("textarea");
      textArea.innerHTML = text;
      return textArea.value;
    },
  },
  mounted() {
    this.fetchPosts(); // Fetch posts when the component is mounted
  },
};
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.post-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.post-meta {
  margin-top: 5px;
  color: #555;
  font-size: 0.9rem;
}

.post-content h3 {
  margin: 0;
  font-size: 1.25rem;
}

.points,
.author,
.time {
  font-size: 0.9rem;
}

.points {
  color: #ff6f00;
}

.comment-button {
  background: none;
  border: none;
  color: grey;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.comment-button i {
  margin-left: 5px;
}

.post-icons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-button {
  background: none;
  border: none;
  color: grey;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.icon-button i {
  font-size: 1.2rem;
}

.post-comments {
  margin-top: 15px;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.comment {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  text-decoration: underline;
}
</style>
