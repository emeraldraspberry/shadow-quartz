<template>
  <div id="viewer" class="mt1 w-flex column">
    <div id="viewer-controls" class="w-flex justify-left align-center no-grow">
      <w-icon class="icon" xl>material-icons view_list</w-icon>
      <w-icon xl @click="openFile">material-icons folder_open</w-icon>
      <w-input
        placeholder="file path"
        id="path-input"
        v-model="pathInput"
        @keyup.enter="enterPath"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <p>Page</p>
      <w-input
        id="page-input"
        v-model.number="pageInput"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <p id="page-index">({{ page }} of {{ pageTotal }})</p>
      <w-icon xl @click="firstPage">material-icons first_page</w-icon>
      <w-icon xl @click="decrementPage">material-icons chevron_left</w-icon>
      <w-icon xl @click="incrementPage">material-icons chevron_right</w-icon>
      <w-icon xl @click="lastPage">material-icons last_page</w-icon>
      <w-input
        placeholder="1.00"
        id="scale-input"
        v-model.number="scaleInput"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
      <w-icon xl @click="doFitWidth = true">material-icons swap_horiz</w-icon>
      <w-icon xl @click="doFitHeight = true">material-icons swap_vert</w-icon>
      <p>Find</p>
      <w-input
        id="find-input"
        v-model="findQuery"
        outline
        bg-color="grey-dark5"
        color="white"
      ></w-input>
    </div>
    <!-- Key events are placed on a div container, since adding them
     on the Pdf component will fire an unwanted update in Pdf. -->
    <div
      ref="keydown"
      class="grow w-flex"
      @keydown.left="decrementPage"
      @keydown.right="incrementPage"
      @keydown.home="firstPage"
      @keydown.end="lastPage"
      tabindex="0"
    >
      <!-- Pdf gets updated twice upon adjusting fit width and fit height.
     Find a better way. -->
      <Pdf
        v-if="isPathReceived && pathInput.endsWith('pdf')"
        :path="pathInput"
        :page="pageInput"
        :scale="scaleInput"
        :doFitWidth="doFitWidth"
        :doFitHeight="doFitHeight"
        @done-fit-adjust="updateScale"
        @page-change="updatePage"
      ></Pdf>
      <Epub
        v-if="isPathReceived && pathInput.endsWith('epub')"
        :path="pathInput"
      ></Epub>
    </div>
  </div>
</template>

<script>
import Pdf from "@/components/Pdf";
import Epub from "@/components/Epub";
export default {
  name: "Viewer",
  components: {
    Pdf: Pdf,
    Epub: Epub,
  },
  props: {
    referredPath: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isPathReceived: false,
      pathInput: this.$store.state.pdf.path,
      pageInput: this.$store.state.pdf.page,
      scaleInput: this.$store.state.pdf.scale,
      doFitWidth: false,
      doFitHeight: false,
      findQuery: "",
    };
  },
  computed: {
    path() {
      return this.$store.state.pdf.path;
    },
    page() {
      return this.$store.state.pdf.page;
    },
    pageTotal() {
      return this.$store.state.pdf.pageTotal;
    },
    scale() {
      return this.$store.state.pdf.scale;
    },
  },
  methods: {
    openFile() {
      window.ipcRenderer.send("open-file");
    },
    enterPath() {
      this.pushHistory(this.pathInput);
      this.isPathReceived = true;
    },
    doesPathExists() {
      if (this.referredPath !== "") {
        this.pathInput = this.referredPath;

        this.pushHistory(this.pathInput);
        this.isPathReceived = true;
      } else if (this.path.length !== 0) {
        this.isPathReceived = true;
      }
    },
    incrementPage() {
      if (this.pageInput < this.pageTotal) {
        this.pageInput += 1;
      }
    },
    decrementPage() {
      if (this.pageInput > 1) {
        this.pageInput -= 1;
      }
    },
    firstPage() {
      this.pageInput = 1;
    },
    lastPage() {
      this.pageInput = this.pageTotal;
    },
    incrementScale() {
      this.scaleInput = Math.round((this.scaleInput + 0.1) * 100) / 100;
    },
    decrementScale() {
      if (this.scaleInput > 0) {
        this.scaleInput = Math.round((this.scaleInput - 0.1) * 100) / 100;
      }
    },
    updateScale() {
      this.doFitWidth = false;
      this.doFitHeight = false;
      this.scaleInput = this.scale;
    },
    updatePage() {
      this.pageInput = this.page;
    },
    pushHistory(path) {
      const historyList = this.$store.state.app.historyList;
      const newHistoryList = [];

      // If item already exists, omit in new list.
      historyList.forEach((item) => {
        if (item.includes(path) == false) {
          newHistoryList.push(item);
        }
      });
      newHistoryList.push(path);

      this.$store.state.app.historyList = newHistoryList;
    },
    // Vue 3.x doesn't support uncommon key modifiers such as
    // @keydown.ctrl.equal
    // Comment, notify, or pull request if there is a better way
    onKey(event) {
      if (event === undefined) {
        return;
      }
      switch (event.code) {
        case "Equal":
          this.incrementScale();
          break;
        case "Minus":
          this.decrementScale();
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    if (this.$nextTick) {
      this.$refs["keydown"].addEventListener("keydown", this.onKey);
    }
    // PDF load check
    this.doesPathExists();
    window.ipcRenderer.on("return-file-path", (event, path) => {
      this.pathInput = path;
      this.$store.state.app.historyList.push(this.pathInput);

      this.isPathReceived = true;
    });
  },
  beforeUnmount() {
    this.$refs["keydown"].removeEventListener("keydown", this.onKey);
  },
  unmounted() {
    window.ipcRenderer.removeAllListeners().className;
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
  z-index: 9;
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