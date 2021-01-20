<template>
  <div id="viewer">
    <div id="viewer-controls" class="w-flex justify-left align-center">
      <w-icon class="icon" xl>material-icons view_list</w-icon>
      <w-icon xl @click="openFile">material-icons folder_open</w-icon>
      <w-input
        placeholder="file path"
        id="path-input"
        v-model="path"
        @keyup.enter="enterPath"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <p>Page</p>
      <w-input
        placeholder="0"
        id="page-input"
        v-model="page"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <p id="page-index">({{ page }} of {{ pageTotal }})</p>
      <w-icon xl>material-icons first_page</w-icon>
      <w-icon xl>material-icons chevron_left</w-icon>
      <w-icon xl>material-icons chevron_right</w-icon>
      <w-icon xl>material-icons last_page</w-icon>
      <w-input
        placeholder="1.00"
        id="scale-input"
        v-model="scaleFactor"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <p>Find</p>
      <w-input
        id="find-input"
        v-model="findQuery"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
    </div>
    <Pdf v-if="isPathReceived" :pdfPath="path"></Pdf>
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
      isPathReceived: false,
      path: "",
      page: 0,
      pageTotal: 0,
      scaleFactor: 1.0,
      findQuery: "",
    };
  },
  methods: {
    openFile() {
      console.log("openFile() call");
      window.ipcRenderer.send("open-file");
    },
    enterPath() {
      this.isPathReceived = true;
    },
  },
  mounted() {
    window.ipcRenderer.on("return-file-path", (event, path) => {
      this.path = path;
      this.isPathReceived = true;
    });
  },
  unmounted() {
    window.ipcRenderer.removeAllListeners();
  },
};
</script>

<style lang="scss" scoped>
#path-input {
  min-width: 200px;
}

#page-input {
  max-width: 40px;
}

#scale-input {
  max-width: 60px;
}

#find-input {
  min-width: 100px;
}

#viewer-controls {
  & > * {
    margin-left: 0.25rem;
  }
}

i {
  filter: invert(0);
  background-color: inherit;

  transition: all 0.25s;

  &:hover {
    filter: invert(1);
    background-color: $base-bg-color;
  }
}

p {
  &:not(#page-index) {
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    padding-bottom: 0.125rem;
    letter-spacing: -1px;
  }

  padding-left: 0.2rem;
  min-width: max-content;
}
</style>