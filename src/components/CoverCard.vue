<template>
  <div id="cover-card" class="ma2 w-flex column justify-end no-grow">
    <div id="cover-information">
      <p>{{ title }}</p>
      <p>{{ pages }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CoverCard",
  props: {
    title: {
      type: String,
      required: true,
      default: "Document",
    },
    fileName: {
      type: String,
      required: true,
      default: "Filename",
    },
    fileType: {
      type: String,
      required: true,
      default: "pdf",
    },
    pages: {
      type: Number,
      required: true,
      default: 0,
    },
    currentPage: {
      type: Number,
      required: false,
      default: 1,
    },
    path: {
      type: String,
      required: true,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
#cover-card {
  background-color: darkslategrey;
  width: 240px;
  height: 320px;
}

#cover-information {
  background-color: rgba($base-bg-color, 0.8);
}
</style>