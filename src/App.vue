<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/pdftest">Pdftest</router-link> |
    <router-link to="/viewer">Viewer</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
@font-face {
  font-family: "Lato-Black";
  src: url("./assets/fonts/Lato/Lato-Black.ttf");
}

@font-face {
  font-family: "Varela-Round";
  src: url("./assets/fonts/Varela_Round/VarelaRound-Regular.ttf");
}

#app {
  font-family: "Varela-Round", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $base-bg-color;
  color: darken($base-text-color, 12.5%);
}

h1,
h2,
h3,
h4,
h5 {
  font-family: "Lato-Black", "Gill Sans", Calibri, "Trebuchet MS", sans-serif;
}

a {
  color: darken($base-text-color, 5%);
}
</style>
