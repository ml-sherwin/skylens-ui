<template lang="pug">
.heat-map(ref="mapEl")
</template>

<script lang="ts">
import type { PropType } from "vue";
import {
  defineComponent,
  toRefs,
  shallowRef,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from "#imports";
import { Loader } from "@googlemaps/js-api-loader";
import { MAP_API_KEY } from "~ui/utils/constants";

const RADIUS = 30;

export default defineComponent({
  name: "SLHeatMap",
  components: {},
  props: {
    latlons: {
      type: Array as PropType<{ lat: string; lon: string }[]>,
      default: () => [],
    },
    weights: {
      type: Array as PropType<{ lat: string; lon: string; weight: number }[]>,
      default: () => [],
    },
    isShowMarker: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { latlons, weights, isShowMarker } = toRefs(props);

    const mapEl = shallowRef<HTMLElement | null>(null);
    const apiLoaded = ref(false);

    let map: google.maps.Map | null = null;
    let heatmap: google.maps.visualization.HeatmapLayer | null = null;
    let markers: google.maps.Marker[] = [];

    const loader = new Loader({
      apiKey: MAP_API_KEY,
      version: "weekly",
      libraries: ["visualization"],
    });

    loader.load().then(() => {
      apiLoaded.value = true;
    });

    function setupMap() {
      if (!apiLoaded.value || !mapEl.value) return;

      if (!map) {
        map = new google.maps.Map(mapEl.value, {
          disableDefaultUI: true,
          styles: [
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
      }

      map.setCenter({ lat: 23.586114913594802, lng: 120.87814086119803 });

      setupHeatmapData();
    }

    function setupMarkers() {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => marker.setMap(null));
      markers = [];

      latlons.value.forEach((latlon) => {
        const position = new google.maps.LatLng(
          Number(latlon.lat),
          Number(latlon.lon)
        );
        bounds.extend(position);

        markers.push(
          new google.maps.Marker({
            position,
            map: isShowMarker.value ? map : null,
          })
        );
      });

      if (map) {
        map.fitBounds(bounds, 0);
      }
    }

    function setupHeatmapData() {
      if (!map || latlons.value.length === 0) return;

      const heatMapData = weights.value
        .filter((weight) => weight.weight > 0)
        .map((weight) => ({
          location: new google.maps.LatLng(
            Number(weight.lat),
            Number(weight.lon)
          ),
          weight: weight.weight,
        }));

      if (!heatmap) {
        heatmap = new google.maps.visualization.HeatmapLayer({
          radius: RADIUS,
        });
        heatmap.setMap(map);
      }

      heatmap.setData(heatMapData);
    }

    watch(apiLoaded, setupMap);
    watch(latlons, () => {
      setupMarkers();
    });
    watch(weights, () => {
      setupHeatmapData();
    });
    watch(isShowMarker, () => {
      markers.forEach((marker) => {
        marker.setMap(isShowMarker.value ? map : null);
      });
    });

    onMounted(() => {
      setupMap();
    });

    onBeforeUnmount(() => {
      if (heatmap) {
        heatmap.setMap(null);
        heatmap = null;
      }
    });

    return {
      mapEl,
    };
  },
});
</script>

<style lang="stylus">
.heat-map
  @apply w-full h-full
</style>
