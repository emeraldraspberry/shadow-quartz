<template>
  <div id="viewer">
    <div id="viewer-controls" class="w-flex justify-left">
      <w-icon xl @click="openFile">material-icons folder_open</w-icon>
    </div>
    <Pdf v-if="path" :pdfPath="path"></Pdf>
  </div>
</template>

<script>
import Pdf from "@/components/Pdf";
export default {
  name: "Viewer",
  components: {
    Pdf: Pdf,
  },
  data() {
    return {
      path: "",
    };
  },
  methods: {
    openFile() {
      console.log("openFile() call");
      window.ipcRenderer.send("open-file");
    },
  },
  mounted() {
    window.ipcRenderer.on("return-file-path", (event, path) => {
      this.path = path;
    });
  },
  unmounted() {
    window.ipcRenderer.removeAllListeners();
  },
};
</script>

<style lang="scss" scoped>
</style>