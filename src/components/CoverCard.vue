<template>
  <div id="cover-card" class="ma2">
    <w-image
      id="cover-image"
      tag="img"
      :src="imageData"
      width="200"
      @click="routeLink"
    >
    </w-image>
    <div id="cover-information">
      <p>{{ title }}</p>
      <p>{{ author }}</p>
    </div>
  </div>
</template>

<script>
import PdfData from "@/model/PdfData";

export default {
  name: "CoverCard",
  props: {
    path: {
      type: String,
      required: true,
      default: "",
    },
  },
  mounted() {
    this.Data.metaData.then((data) => {
      this.metaData = data;
    });

    this.Data.imageUrl.then((data) => {
      this.imageData = data;
    });
  },
  data() {
    return {
      Data: new PdfData(this.path),
      imageData: null,
      metaData: null,
    };
  },
  computed: {
    author() {
      if (
        this.metaData !== null &&
        this.metaData !== undefined &&
        this.metaData.Author !== "" &&
        this.metaData.Author !== undefined
      ) {
        return this.metaData.info.Author;
      } else {
        return "";
      }
    },
    title() {
      if (
        this.metaData !== null &&
        this.metaData !== undefined &&
        this.metaData.info.Title !== "" &&
        this.metaData.info.Title !== undefined
      ) {
        return this.metaData.info.Title;
      } else {
        return this.path;
      }
    },
  },
  methods: {
    routeLink() {
      this.$router.push({
        name: "Viewer.get",
        params: { referredPath: this.path },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#cover-card {
  position: relative;
  height: min-content;
  max-width: 240px;
  word-break: break-all;
}

#cover-image {
  width: 100%;
}
</style>