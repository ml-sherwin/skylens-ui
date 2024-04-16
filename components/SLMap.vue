<template lang="pug">
.map(ref="mapEl")
</template>

<script lang="ts">
import type { PropType } from "vue";
import { IconLayer } from "@deck.gl/layers/typed";
import { GoogleMapsOverlay } from "@deck.gl/google-maps/typed";
import type { IInputPoi } from "~ui/interface/IPoi";
import { PoiStatus } from "~ui/interface/IPoi";

interface MapMarker {
  coordinates: [number, number];
  marker: "trackedMarker" | "untrackMarker";
}

export default defineComponent({
  name: "SLMap",
  components: {},
  props: {
    controls: {
      type: Boolean,
      default: true,
    },
    latlons: {
      type: Array as PropType<IInputPoi[]>,
      default: () => [],
    },
  },
  setup(props) {
    const { $googlemapsLoader } = useNuxtApp();
    const { controls, latlons } = toRefs(props);

    const mapEl = shallowRef<HTMLElement | null>(null);

    let map: google.maps.Map | null = null;
    let markersOverlay: GoogleMapsOverlay | null = null;

    async function loadGoogleMapsApi() {
      if (!$googlemapsLoader) return;

      await $googlemapsLoader.importLibrary("core");
      await $googlemapsLoader.importLibrary("maps");
      await $googlemapsLoader.importLibrary("marker");

      setupMap();
    }

    function resetMarkersIcon() {
      // markers.forEach((marker) => {
      //   if (marker.get('poiType') === PoiStatus.Tracking) {
      //     marker.setIcon(trackingMarkerIcon);
      //   } else if (marker.get('poiType') === PoiStatus.Untrack) {
      //     marker.setIcon(untrackMarkerIcon);
      //   }
      // });
    }

    function buildMarkers() {
      if (!map || !markersOverlay) return;

      const bounds = new google.maps.LatLngBounds();
      markersOverlay.setProps({
        layers: [
          new IconLayer<MapMarker>({
            id: "IconLayer",
            data: latlons.value.map((latlon) => {
              bounds.extend(
                new google.maps.LatLng({
                  lat: Number(latlon.lat),
                  lng: Number(latlon.lon),
                })
              );

              return {
                coordinates: [Number(latlon.lon), Number(latlon.lat)],
                marker:
                  latlon.status === PoiStatus.Tracking
                    ? "trackedMarker"
                    : "untrackMarker",
              };
            }),
            getIcon: (d: MapMarker) => d.marker,
            getPosition: (d: MapMarker) => d.coordinates,
            getSize: () => 5,
            iconAtlas: "/assets/images/commons/map-markers.png",
            iconMapping: {
              trackedMarker: {
                x: 0,
                y: 0,
                width: 21,
                height: 28,
                anchorY: 28,
                mask: false,
              },
              untrackMarker: {
                x: 21,
                y: 0,
                width: 21,
                height: 28,
                anchorY: 28,
                mask: false,
              },
            },
            sizeScale: 5,
            pickable: false,
          }),
        ],
      });

      if (latlons.value.length === 0) {
        map.setCenter({ lat: 23.586114913594802, lng: 120.87814086119803 });
        map.setZoom(7);
        return;
      }
      map.fitBounds(bounds);
    }

    function setupMap() {
      if (!mapEl.value) return;

      let controlOptions: {
        disableDefaultUI?: boolean;
        zoomControl?: boolean;
        mapTypeControl?: boolean;
        scaleControl?: boolean;
        streetViewControl?: boolean;
        rotateControl?: boolean;
        fullscreenControl?: boolean;
      } = {
        disableDefaultUI: true,
      };

      if (controls.value) {
        controlOptions = {
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
        };
      }

      map = new google.maps.Map(mapEl.value, {
        center: { lat: 23.586114913594802, lng: 120.87814086119803 },
        zoom: 7,
        ...controlOptions,
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

      markersOverlay = new GoogleMapsOverlay({});
      markersOverlay.setMap(map);

      buildMarkers();

      // map.addListener('click', () => {
      //   resetMarkersIcon();
      // });
    }

    watch(
      latlons,
      () => {
        buildMarkers();
      },
      { deep: true }
    );

    onMounted(() => {
      loadGoogleMapsApi();
    });

    onBeforeUnmount(() => {
      if (markersOverlay) {
        markersOverlay.finalize();
      }

      markersOverlay = null;
      map = null;
    });

    return {
      mapEl,
    };
  },
});
</script>

<style lang="stylus">
.map
  @apply w-full h-full
</style>
