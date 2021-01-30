<template>
  <div id="home" class="w-flex">
    <div v-if="false" class="ml2 w-flex column no-grow">
      <h1>Know</h1>
      <a
        href="https://en.wikipedia.org/wiki/Aaron_Swartz#Open_Access"
        target="_blank"
        rel="noopener noreferrer"
        >Open access</a
      >
      <a
        href="https://en.wikipedia.org/wiki/Digital_preservation"
        target="_blank"
        rel="noopener noreferrer"
        >Perservation</a
      >
      <a
        href="https://en.wikipedia.org/wiki/Freedom_of_information"
        target="_blank"
        rel="noopener noreferrer"
        >Information Freedom</a
      >
      <a
        href="https://en.wikipedia.org/wiki/Textbook#Bundling_in_the_USA"
        target="_blank"
        rel="noopener noreferrer"
        >Bundling</a
      >
      <a
        href="https://stallman.org/ebooks.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        DRM
      </a>
    </div>
    <div class="ml2 w-flex grow column">
      <h1>Recent</h1>
      <div id="recent" class="w-flex wrap">
        <CoverCard
          v-for="item in historyList"
          :key="item"
          :path="item"
        ></CoverCard>
      </div>
      <h1>Important</h1>
      <div id="important" class="w-flex wrap"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CoverCard from "@/components/CoverCard";

export default {
  name: "Home",
  components: {
    CoverCard: CoverCard,
  },
  data() {
    return {
      historyList: this.$store.state.app.historyList.slice().reverse(),
    };
  },
};
</script>

<style lang="scss" scoped>
#recent,
#important {
  max-height: min-content;
}
</style>
