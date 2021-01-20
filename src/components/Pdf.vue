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
    pdfPath: String,
  },
  computed: {
    localPdfPath() {
      return "local-resource://" + this.pdfPath;
    },
  },
  data() {
    return {
      pdfPage: 1,
    };
  },
  updated() {
    this.getPdf();
  },
  mounted() {
    this.getPdf();
    console.log(this.$store.state.pdf.page);
  },
  methods: {
    getPdf() {
      if (this.pdfPath.length !== 0) {
        const loadingTask = pdfjsLib.getDocument(this.localPdfPath);

        loadingTask.promise.then((pdf) => {
          pdf.getPage(this.pdfPage).then((page) => {
            let scale = 1.25;
            let viewport = page.getViewport({ scale: scale });

            let canvas = document.getElementById("pdf-canvas");
            let context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            // Update pdf store module
            this.$store.state.pdf.page = this.pdfPage;
            this.$store.state.pdf.pageTotal = pdf.numPages;
            this.$store.state.pdf.scale = scale;

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