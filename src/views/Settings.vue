<template>
  <div id="settings" class="ml2">
    <h1>Settings</h1>
    <w-tabs
      :items="tabs"
      slider-color="lime"
      color="white"
      active-class="green"
      transition="fade"
    >
      <!-- <template #item-title="{ item }">
        <span class="green">{{ item.title }}</span>
      </template> -->
      <template #[`item-content.1`]>
        <div class="w-flex column">
          <span class="title2">Theme</span>
          <div class="w-flex row">
            <w-switch
              color="green"
              label="Enable dark mode"
              v-model="isDarkMode"
            ></w-switch>
          </div>
        </div>
      </template>
      <template #[`item-content.2`]>
        <span class="title3">Local store</span>
        <pre>{{ $store.state }}</pre>
      </template>
    </w-tabs>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      tabs: [
        { title: "General", content: "Tab 1 content." },
        { title: "Debug", content: "Tab 3 content." },
      ],
      isDarkMode: true,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>