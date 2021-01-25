import workerSrc from "!!file-loader!pdfjs-dist/build/pdf.worker.min.js";
const pdfjsLib = require(/* webpackChunkName: "pdfjs-dist" */ `pdfjs-dist`);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

class PdfData {
  constructor(path) {
    // Prepend path to prepare for local loading
    this.path = "local-resource://" + path;

    // Prepare task
    this.documentTask = pdfjsLib.getDocument(this.path);
  }

  get imageUrl() {
    return new Promise((resolve) => {
      this.documentTask.promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
          let viewport = page.getViewport({ scale: 1 });
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          const renderTask = page.render(renderContext);
          renderTask.promise.then(() => {
            resolve(canvas.toDataURL("image/png"));

            // Free pdf instance for memory reallocation
            pdf.destroy();
          });
        });
      });
    });
  }

  get metaData() {
    return new Promise((resolve) => {
      this.documentTask.promise.then((pdf) => {
        pdf.getMetadata().then((data) => {
          resolve(data);
        });
      });
    });
  }
}

export default PdfData;
