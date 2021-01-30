<template>
  <div id="epub-component" class="grow">
    <div id="epub-viewer"></div>
  </div>
</template>

<script>
import ePub from "epubjs";
export default {
  name: "Epub",
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  updated() {},
  mounted() {
    let params =
      URLSearchParams &&
      new URLSearchParams(document.location.search.substring(1));
    // let url =
    //   params && params.get("url") && decodeURIComponent(params.get("url"));
    let currentSectionIndex =
      params && params.get("loc") ? params.get("loc") : undefined;

    this.book = ePub(this.localPdfPath);
    this.rendition = this.book.renderTo("epub-viewer", {
      manager: "continuous",
      flow: "scolled",
      width: "100%",
      height: "100%",
    });

    this.displayed = this.rendition.display(currentSectionIndex);
  },
  data() {
    return {
      book: null,
      rendition: null,
      displayed: null,
    };
  },
  computed: {
    localPdfPath() {
      return "local-resource://" + this.path;
    },
  },
};
</script>

<style lang="scss">
#epub-component {
  position: relative;
  overflow: auto;
}

#epub-viewer {
  background-color: rgba(invert($base-bg-color), 0.875);
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  overflow: auto;
}
</style>