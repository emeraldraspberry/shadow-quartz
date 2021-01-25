<template>
  <div id="library">
    <h1>Library</h1>
    <div class="w-flex wrap">
      <CoverCard
        v-for="item in list.slice(0, 10)"
        :key="item"
        :path="item"
      ></CoverCard>
    </div>
  </div>
</template>

<script>
import CoverCard from "@/components/CoverCard";

export default {
  name: "Library",
  components: {
    CoverCard: CoverCard,
  },
  mounted() {
    this.getFiles();
    this.onGetFiles();
  },
  unmounted() {
    window.ipcRenderer.removeAllListeners();
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    getFiles() {
      window.ipcRenderer.send(
        "get-library-files",
        this.$store.state.app.directoryPath
      );
    },
    onGetFiles() {
      window.ipcRenderer.on("get-library-files-reply", (event, args) => {
        // this.list = args;
        if (args !== undefined) {
          args.forEach((path) => {
            if (path.includes("pdf")) {
              this.list.push(path);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>