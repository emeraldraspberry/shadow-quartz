<template>
  <div id="shadows" class="ml2 w-flex column">
    <div class="w-flex no-grow">
      <h2 class="mr2">Shadows</h2>
      <w-select
        :items="sources"
        v-model="source"
        class="mr2"
        bg-color="grey-dark5"
        color="white"
        placeholder="Library source"
        item-class="black"
        menu-class="black"
        selection-color="black"
      ></w-select>
    </div>

    <iframe
      ref="frame"
      v-if="source"
      class="w-flex mr2 mb2"
      :src="source"
      sandbox="allow-forms allow-downloads allow-scripts"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "Shadows",
  mounted() {
    this.sources.forEach((obj) => {
      obj.label = this.inverseLastBitOfString(obj.label);
      obj.value = this.inverseLastBitOfString(obj.value);
    });
  },
  data() {
    return {
      source: "",
      // Sources are absolutely 100% intended for use in fetching and
      // downloading archives of libre Linux guides, manuals, and books.
      // At your own peril, ok buddy baka? (´• ω •`) ♡
      sources: [
        { label: "Rbh,Itc!)en(", value: "iuuqr;..rbh,itc/en." },
        { label: "Rbh,Itc!)ru(", value: "iuuqr;..rbh,itc/ru." },
        { label: "Rbh,Itc!)rd(", value: "iuuqr;..rbh,itc/rd." },
        { label: "Mhcs`sx!Fdodrhr!)sr(", value: "iuuq;..mhcfdo/sr" },
        { label: "Mhcs`sx!Fdodrhr!)hr(", value: "iuuq;..mhcfdo/hr" },
        { label: "Mhcs`sx!Fdodrhr!)ru(", value: "iuuq;..mhcfdo/ru" },
        { label: "[,Mhcs`sx", value: "iuuqr;..{,mhc/nsf." },
        { label: "[,Mhcs`sx!)cnnjgh(", value: "iuuq;..do/cnnjgh/odu." },
      ],
    };
  },
  methods: {
    inverseLastBitOfString(str) {
      let newStr = "";
      for (const idx in str) {
        const encode = str.charCodeAt(idx) ^ 0b1;
        newStr += String.fromCodePoint(encode);
      }
      return newStr;
    },
  },
};
</script>

<style lang="scss" scoped>
iframe {
  background-color: white;
}
</style>