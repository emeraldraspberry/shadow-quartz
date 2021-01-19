<template>
  <canvas id="pdf-canvas"></canvas>
</template>

<script>
import workerSrc from "!!file-loader!pdfjs-dist/build/pdf.worker.min.js";
const pdfjsLib = require(/* webpackChunkName: "pdfjs-dist" */ `pdfjs-dist`);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default {
  name: "PdfTest",
  mounted() {
    this.getPdf();
  },
  methods: {
    getPdf() {
      const loadingTask = pdfjsLib.getDocument(
        "local-resource:///home/emeraspbe/git/shadow-quartz/src/assets/file.pdf"
      );

      loadingTask.promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
          let scale = 1;
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
    },
  },
};
</script>

<style lang="scss" scoped>
</style>