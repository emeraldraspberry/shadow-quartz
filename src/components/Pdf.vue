<template>
  <div class="pdf grow" ref="container">
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
    doFitWidth: {
      type: Boolean,
      default: false,
    },
    doFitHeight: {
      type: Boolean,
      default: false,
    },
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
    console.log(this.$el, "updated");
    this.loadingTask.destroy();
    this.getPdf();
  },
  mounted() {
    console.log(this.$el, "mounted");
    this.getPdf();
  },
  methods: {
    getPdf() {
      if (this.path.length !== 0) {
        this.loadingTask = pdfjsLib.getDocument(this.localPdfPath);

        console.log(this.page);
        this.loadingTask.promise.then((pdf) => {
          pdf.getPage(this.page).then((page) => {
            const container = this.$refs["container"];
            let viewport = page.getViewport({ scale: this.scale });

            let scale = 1;
            let canvas = document.getElementById("pdf-canvas");
            let context = canvas.getContext("2d");
            if (this.doFitWidth) {
              viewport = page.getViewport({ scale: scale });
              scale = container.clientWidth / viewport.width;
              viewport = page.getViewport({ scale: scale });
            }

            if (this.doFitHeight) {
              viewport = page.getViewport({ scale: 0 });
              scale = container.clientHeight / viewport.height;
              viewport = page.getViewport({ scale: scale });

              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };

              page.render(renderContext);

              viewport = page.getViewport({ scale: 1 });
              scale = container.clientHeight / viewport.height;
              viewport = page.getViewport({ scale: scale });
            }

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
            if (this.doFitWidth || this.doFitHeight) {
              this.$store.state.pdf.scale = scale;
              this.$emit("done-fit-adjust");
            } else {
              this.$store.state.pdf.scale = this.scale;
            }

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