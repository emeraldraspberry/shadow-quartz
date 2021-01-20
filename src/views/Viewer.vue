<template>
  <div id="viewer">
    <div id="viewer-controls" class="w-flex justify-left align-center">
      <w-icon class="icon" xl>material-icons view_list</w-icon>
      <w-icon xl @click="openFile">material-icons folder_open</w-icon>
      <w-input
        placeholder="file path"
        id="path-input"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <p>Page</p>
      <w-input
        placeholder="0"
        id="page-input"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <p id="page-index">(y of x)</p>
      <w-icon xl>material-icons first_page</w-icon>
      <w-icon xl>material-icons chevron_left</w-icon>
      <w-icon xl>material-icons chevron_right</w-icon>
      <w-icon xl>material-icons last_page</w-icon>
      <w-input
        placeholder="1.00"
        id="scale-input"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <p>Find</p>
      <w-input
        id="find-input"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
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