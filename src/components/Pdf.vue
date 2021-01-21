<template>
  <div class="pdf">
    <canvas id="pdf-canvas"></canvas>
  </div>
</template>

<script>
import workerSrc from "!!file-loader!pdfjs-dist/build/pdf.worker.min.js";
const pdfjsLib = require(/* webpackChunkName: "pdfjs-dist" */ `pdfjs-dist`);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default {
  name: "Pdf",
  props: {
    path: String,
    page: Number,
    scale: Number,
  },
  computed: {
    localPdfPath() {
      return "local-resource://" + this.path;
    },
  },
  data() {
    return {
      loadingTask: null,
    };
  },
  updated() {
    this.loadingTask.destroy();
    this.getPdf();
  },
  mounted() {
    this.getPdf();
  },
  methods: {
    getPdf() {
      if (this.path.length !== 0) {
        this.loadingTask = pdfjsLib.getDocument(this.localPdfPath);

        console.log(this.page);
        this.loadingTask.promise.then((pdf) => {
          pdf.getPage(this.page).then((page) => {
            let viewport = page.getViewport({ scale: this.scale });

            let canvas = document.getElementById("pdf-canvas");
            let context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            // Update pdf store module
            this.$store.state.pdf.path = this.path;
            this.$store.state.pdf.page = this.page;
            this.$store.state.pdf.pageTotal = pdf.numPages;
            this.$store.state.pdf.scale = this.scale;

            page.render(renderContext);
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>