import { Loader } from "@googlemaps/js-api-loader";

declare module '#app' {
  interface NuxtApp {
    $googlemapsLoader: Loader;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const loader = new Loader({
    apiKey: MAP_API_KEY,
    version: "weekly",
    libraries: ["core", "maps", "marker", "visualization"],
  });

  nuxtApp.provide('googlemapsLoader', loader);
});