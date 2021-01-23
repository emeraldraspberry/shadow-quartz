<template>
  <div id="message-dialog">
    <w-dialog
      v-if="status.includes('info')"
      content-class="grey-dark5--bg"
      title-class="info-dark3--bg"
      transition="bounce"
    >
      <template #title>
        <w-icon xl class="mr2">material-icons info</w-icon>
        Information
      </template>
      <slot></slot>
    </w-dialog>
    <w-dialog
      v-else-if="status.includes('success')"
      content-class="grey-dark5--bg"
      title-class="success-dark3--bg"
      transition="bounce"
    >
      <template #title>
        <w-icon xl class="mr2">material-icons check_circle</w-icon>
        Success
      </template>
      <slot></slot>
    </w-dialog>
    <w-dialog
      v-else-if="status.includes('warning')"
      content-class="grey-dark5--bg"
      title-class="warning-dark3--bg"
      transition="bounce"
    >
      <template #title>
        <w-icon xl class="mr2">material-icons warning</w-icon>
        Warning
      </template>
      <slot></slot>
    </w-dialog>
    <w-dialog
      v-else-if="status.includes('error')"
      content-class="grey-dark5--bg"
      title-class="error-dark3--bg"
      transition="bounce"
    >
      <template #title>
        <w-icon xl class="mr2">material-icons error</w-icon>
        Error
      </template>
      <slot></slot>
    </w-dialog>
  </div>
</template>

<script>
export default {
  name: "MessageDialog",
  props: {
    status: {
      type: String,
      default: "info",
      validator: (value) => {
        // Must match a string
        return ["success", "error", "warning", "info"].indexOf(value) !== -1;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>