<template>
  <w-app>
    <div id="nav" class="ma1">
      <router-link to="/">Home</router-link> |
      <router-link to="/viewer">Viewer</router-link> |
      <router-link to="/shadows">Shadows</router-link> |
      <router-link to="/library">Library</router-link> |
      <router-link to="/settings">Settings</router-link>
    </div>
    <router-view />
    <MessageDialog status="welcome" v-if="isDirectoryPathEmpty && isNew">
      <p>
        Shadow Quartz requires a primary directory path for optimal use. This
        directory can be used to store history, manage downloads, save
        libraries, and cache image previews.
      </p>
      <br />
      <p>The primary directory can be set later in the Settings view.</p>
      <div class="w-flex justify-center mt4">
        <w-button @click="selectDirectory">Select Directory</w-button>
        <w-button @click="isNew = false" class="ml2">Close</w-button>
      </div>
    </MessageDialog>
  </w-app>
</template>

<script>
import MessageDialog from "@/components/MessageDialog";
export default {
  name: "App",
  components: {
    MessageDialog: MessageDialog,
  },
  mounted() {
    window.ipcRenderer.send("load-settings");
    window.ipcRenderer.on("load-settings-reply", (event, args) => {
      this.settings = args.settings;
      this.vstoreSettings();
    });
    window.ipcRenderer.on("select-directory-reply", (event, args) => {
      if (args) {
        this.isNew = false;
        console.log("Directory path successfully stored.");
      }
    });
  },
  unmounted() {
    window.ipcRenderer.removeAllListeners();
  },
  computed: {
    isDirectoryPathEmpty() {
      if (this.settings !== null && this.settings.library.path.length === 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  data() {
    return {
      settings: null,
      isNew: true,
    };
  },
  methods: {
    selectDirectory() {
      window.ipcRenderer.send("select-directory");
    },
    vstoreSettings() {
      if (!this.isDirectoryPathEmpty) {
        this.$store.state.app.directoryPath = this.settings.library.path;
      }
    },
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "Lato-Black";
  src: url("./assets/fonts/Lato/Lato-Black.ttf");
}

@font-face {
  font-family: "Varela-Round";
  src: url("./assets/fonts/Varela_Round/VarelaRound-Regular.ttf");
}

#app {
  font-family: "Varela-Round", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $base-bg-color;
  color: darken($base-text-color, 12.5%);
}

#nav {
  z-index: 99;

  & > a {
    padding: 0.125rem;
    border-radius: 0.125rem;

    background-color: $base-bg-color;
    transition: all 0.5s;
  }

  & > a:hover {
    background-color: invert($base-bg-color);
    color: invert($base-text-color);
  }

  .router-link-active {
    background-color: invert($base-bg-color);
    color: invert($base-text-color);
  }
}

html {
  background-color: $base-bg-color;
}

h1,
h2,
h3,
h4,
h5 {
  font-family: "Lato-Black", "Gill Sans", Calibri, "Trebuchet MS", sans-serif;
}

a {
  color: darken($base-text-color, 5%);
}
</style>
