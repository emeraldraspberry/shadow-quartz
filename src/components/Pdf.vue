<template>
  <div class="pdf grow" ref="container">
    <div id="viewer" class="w-flex row" ref="viewer"></div>
  </div>
</template>

<script>
import workerSrc from "!!file-loader!pdfjs-dist/build/pdf.worker.min.js";
const pdfjsLib = require(/* webpackChunkName: "pdfjs-dist" */ `pdfjs-dist`);
const pdfjsViewer = require(/* webpackChunkName: "pdfjs-dist" */ "pdfjs-dist/web/pdf_viewer");
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
      container: null,
      loadedPath: "",
      loadedPdfDoc: null,
      loadingTask: null,
      eventBus: null,
      pdfLinkService: null,
      pdfFindController: null,
      pdfSinglePageViewer: null,
    };
  },
  updated() {
    console.log(this.$el, "updated");
    // this.loadingTask.destroy();
    this.updatePdf();
  },
  mounted() {
    console.log(this.$el, "mounted");
    this.container = this.$refs["container"];

    this.eventBus = new pdfjsViewer.EventBus();
    this.pdfLinkService = new pdfjsViewer.PDFLinkService({
      eventBus: this.eventBus,
    });
    this.pdfFindController = new pdfjsViewer.PDFFindController({
      eventBus: this.eventBus,
      linkService: this.pdfLinkService,
    });
    this.pdfSinglePageViewer = new pdfjsViewer.PDFSinglePageViewer({
      container: this.container,
      eventBus: this.eventBus,
      linkService: this.pdfLinkService,
      findController: this.pdfFindController,
      removePageBorders: true,
    });

    this.pdfLinkService.setViewer(this.pdfSinglePageViewer);

    this.eventBus.on("pagesinit", () => {
      this.pdfSinglePageViewer.currentScaleValue = "page-width";
    });

    this.eventBus.on("pagechanging", () => {
      this.$store.state.pdf.page = this.pdfSinglePageViewer.currentPageNumber;
      this.$emit("page-change");
    });

    if (this.path.length !== 0) {
      this.loadingTask = pdfjsLib.getDocument({
        url: this.localPdfPath,
      });

      this.loadingTask.promise.then((pdfDoc) => {
        this.pdfSinglePageViewer.setDocument(pdfDoc);
        this.pdfLinkService.setDocument(pdfDoc, null);

        this.$store.state.pdf.path = this.path;
        this.$store.state.pdf.page = this.page;
        this.$store.state.pdf.scale = this.scale;
        this.$store.state.pdf.pageTotal = this.pdfSinglePageViewer.pdfDocument._pdfInfo.numPages;
      });
    }
  },
  methods: {
    updatePdf() {
      if (this.path.length !== 0) {
        // On new path (load another pdf)
        if (this.path !== this.$store.state.pdf.path) {
          this.loadingTask = pdfjsLib.getDocument({
            url: this.localPdfPath,
          });
          this.loadingTask.promise.then((pdfDoc) => {
            this.pdfSinglePageViewer.setDocument(pdfDoc);
            this.pdfLinkService.setDocument(pdfDoc, null);

            this.$store.state.pdf.path = this.path;
            this.$store.state.pdf.page = 1;
            this.$store.state.pdf.scale = this.scale;
            this.$store.state.pdf.pageTotal = this.pdfSinglePageViewer.pdfDocument._pdfInfo.numPages;
          });

          this.pdfSinglePageViewer.currentPageNumber = 1;
        }

        if (this.path === this.$store.state.pdf.path) {
          this.pdfSinglePageViewer.currentPageNumber = this.page;
          this.$store.state.pdf.page = this.page;
        }

        this.$store.state.pdf.path = this.path;
        this.$store.state.pdf.pageTotal = this.pdfSinglePageViewer.pdfDocument._pdfInfo.numPages;

        // On scale change
        if (this.doFitWidth || this.doFitHeight) {
          this.pdfSinglePageViewer.currentScaleValue = "page-width";
          this.$store.state.pdf.scale = this.pdfSinglePageViewer.currentScaleValue;
          this.$emit("done-fit-adjust");
        } else {
          this.pdfSinglePageViewer.currentScaleValue = this.scale;
          this.$store.state.pdf.scale = this.scale;
        }
      }
    },
  },
};
</script>

<style lang="scss">
.page {
  position: relative;
}

.annotationLayer section {
  position: absolute;
  text-align: initial;
}

.annotationLayer .linkAnnotation > a,
.annotationLayer .buttonWidgetAnnotation.pushButton > a {
  position: absolute;
  font-size: 1em;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.annotationLayer .linkAnnotation > a:hover,
.annotationLayer .buttonWidgetAnnotation.pushButton > a:hover {
  opacity: 0.2;
  background: rgba(255, 255, 0, 1);
  box-shadow: 0 2px 10px rgba(255, 255, 0, 1);
}

.annotationLayer .textAnnotation img {
  position: absolute;
  cursor: pointer;
}

.annotationLayer .textWidgetAnnotation input,
.annotationLayer .textWidgetAnnotation textarea,
.annotationLayer .choiceWidgetAnnotation select,
.annotationLayer .buttonWidgetAnnotation.checkBox input,
.annotationLayer .buttonWidgetAnnotation.radioButton input {
  background-color: rgba(0, 54, 255, 0.13);
  border: 1px solid transparent;
  box-sizing: border-box;
  font-size: 9px;
  height: 100%;
  margin: 0;
  padding: 0 3px;
  vertical-align: top;
  width: 100%;
}

.annotationLayer .choiceWidgetAnnotation select option {
  padding: 0;
}

.annotationLayer .buttonWidgetAnnotation.radioButton input {
  border-radius: 50%;
}

.annotationLayer .textWidgetAnnotation textarea {
  font: message-box;
  font-size: 9px;
  resize: none;
}

.annotationLayer .textWidgetAnnotation input[disabled],
.annotationLayer .textWidgetAnnotation textarea[disabled],
.annotationLayer .choiceWidgetAnnotation select[disabled],
.annotationLayer .buttonWidgetAnnotation.checkBox input[disabled],
.annotationLayer .buttonWidgetAnnotation.radioButton input[disabled] {
  background: none;
  border: 1px solid transparent;
  cursor: not-allowed;
}

.annotationLayer .textWidgetAnnotation input:hover,
.annotationLayer .textWidgetAnnotation textarea:hover,
.annotationLayer .choiceWidgetAnnotation select:hover,
.annotationLayer .buttonWidgetAnnotation.checkBox input:hover,
.annotationLayer .buttonWidgetAnnotation.radioButton input:hover {
  border: 1px solid rgba(0, 0, 0, 1);
}

.annotationLayer .textWidgetAnnotation input:focus,
.annotationLayer .textWidgetAnnotation textarea:focus,
.annotationLayer .choiceWidgetAnnotation select:focus {
  background: none;
  border: 1px solid transparent;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before,
.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after,
.annotationLayer .buttonWidgetAnnotation.radioButton input:checked:before {
  background-color: rgba(0, 0, 0, 1);
  content: "";
  display: block;
  position: absolute;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before,
.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after {
  height: 80%;
  left: 45%;
  width: 1px;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before {
  transform: rotate(45deg);
}

.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after {
  transform: rotate(-45deg);
}

.annotationLayer .buttonWidgetAnnotation.radioButton input:checked:before {
  border-radius: 50%;
  height: 50%;
  left: 30%;
  top: 20%;
  width: 50%;
}

.annotationLayer .textWidgetAnnotation input.comb {
  font-family: monospace;
  padding-left: 2px;
  padding-right: 0;
}

.annotationLayer .textWidgetAnnotation input.comb:focus {
  /*
   * Letter spacing is placed on the right side of each character. Hence, the
   * letter spacing of the last character may be placed outside the visible
   * area, causing horizontal scrolling. We avoid this by extending the width
   * when the element has focus and revert this when it loses focus.
   */
  width: 115%;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input,
.annotationLayer .buttonWidgetAnnotation.radioButton input {
  appearance: none;
  padding: 0;
}

.annotationLayer .popupWrapper {
  position: absolute;
  width: 20em;
}

.annotationLayer .popup {
  position: absolute;
  z-index: 200;
  max-width: 20em;
  background-color: rgba(255, 255, 153, 1);
  box-shadow: 0 2px 5px rgba(136, 136, 136, 1);
  border-radius: 2px;
  padding: 6px;
  margin-left: 5px;
  cursor: pointer;
  font: message-box;
  font-size: 9px;
  white-space: normal;
  word-wrap: break-word;
}

.annotationLayer .popup > * {
  font-size: 9px;
}

.annotationLayer .popup h1 {
  display: inline-block;
}

.annotationLayer .popup span {
  display: inline-block;
  margin-left: 5px;
}

.annotationLayer .popup p {
  border-top: 1px solid rgba(51, 51, 51, 1);
  margin-top: 2px;
  padding-top: 2px;
}

.annotationLayer .highlightAnnotation,
.annotationLayer .underlineAnnotation,
.annotationLayer .squigglyAnnotation,
.annotationLayer .strikeoutAnnotation,
.annotationLayer .freeTextAnnotation,
.annotationLayer .lineAnnotation svg line,
.annotationLayer .squareAnnotation svg rect,
.annotationLayer .circleAnnotation svg ellipse,
.annotationLayer .polylineAnnotation svg polyline,
.annotationLayer .polygonAnnotation svg polygon,
.annotationLayer .caretAnnotation,
.annotationLayer .inkAnnotation svg polyline,
.annotationLayer .stampAnnotation,
.annotationLayer .fileAttachmentAnnotation {
  cursor: pointer;
}

.textLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1;
}

.textLayer > span {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
}

.textLayer .highlight {
  margin: -1px;
  padding: 1px;
  background-color: rgba(180, 0, 170, 1);
  border-radius: 4px;
}

.textLayer .highlight.begin {
  border-radius: 4px 0 0 4px;
}

.textLayer .highlight.end {
  border-radius: 0 4px 4px 0;
}

.textLayer .highlight.middle {
  border-radius: 0;
}

.textLayer .highlight.selected {
  background-color: rgba(0, 100, 0, 1);
}

.textLayer ::selection {
  background: rgba(0, 0, 255, 1);
}

.textLayer .endOfContent {
  display: block;
  position: absolute;
  left: 0;
  top: 100%;
  right: 0;
  bottom: 0;
  z-index: -1;
  cursor: default;
  user-select: none;
}

.textLayer .endOfContent.active {
  top: 0;
}
</style>