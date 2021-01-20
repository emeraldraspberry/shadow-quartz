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
  mounted() {
    this.getPdf();
  },
  methods: {
    getPdf() {
      if (this.pdfPath.length !== 0) {
        console.log("getPdf() called");
        const loadingTask = pdfjsLib.getDocument(this.localPdfPath);

        loadingTask.promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
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