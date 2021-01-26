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
      this.documentTask.promise
        .then(async (pdf) => {
          let page = await pdf.getPage(1);
          return {
            page,
            pdf,
          };
        })
        .then(async (object) => {
          let { page: page, pdf: pdf } = object;
          let viewport = page.getViewport({ scale: 1 });
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          const renderTask = await page.render(renderContext).promise;
          renderTask;

          return {
            canvas,
            pdf,
          };
        })
        .then((object) => {
          let { canvas: canvas, pdf: pdf } = object;

          resolve(canvas.toDataURL("image/png"));
          // Free pdf instance for memory reallocation
          pdf.destroy();
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
