<template lang="pug">
.chart
  ECharts.vchart(
    :loading="loading"
    :loading-options="loadingOptions"
    :option="formatedOption"
    :update-options="{ notMerge: true }"
    :autoresize="true"
    @highlight="onHighlighted"
    @click="onClicked"
    @mouseover="onMouseOvered"
    @mouseout="onMouseOuted"
    @mousemove="onMouseMoved"
    ref="chartComp"
  )
</template>

<script lang="ts">
import type { PropType } from "vue";
import ECharts from "vue-echarts";
import { use } from "echarts/core";
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  HeatmapChart,
  SankeyChart,
  CustomChart,
} from "echarts/charts";
import "echarts-wordcloud";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  PolarComponent,
  GraphicComponent,
  MarkLineComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ECBasicOption } from "echarts/types/dist/shared";

use([
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  HeatmapChart,
  SankeyChart,
  CustomChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  PolarComponent,
  GraphicComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

const DefaultGrid = {
  top: 14,
  right: 0,
  bottom: 0,
  left: 30,
  containLabel: true,
};

type EChartsType = InstanceType<typeof ECharts>;

export default defineComponent({
  name: "SLChart",
  components: {
    ECharts,
  },
  props: {
    option: {
      type: Object as PropType<ECBasicOption | null>,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click", "highlight", "mouseover", "mouseout", "mousemove"],
  setup(props, { emit }) {
    const { option } = toRefs(props);

    const chartComp = shallowRef<EChartsType | null>(null);

    const loadingOptions = computed(() => ({
      color: "#5A5C85",
    }));
    const formatedOption = computed(() => {
      return {
        xAxis: {
          axisLine: {
            lineStyle: {
              color: "#828282",
            },
          },
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: "#828282",
            },
          },
          axisTick: {
            show: true,
          },
          splitLine: {
            lineStyle: {
              color: "#E5E6F4",
              opacity: 0.5,
            },
          },
        },
        tooltip: {
          appendToBody: true,
          padding: 16,
          textStyle: {
            color: "#4F4F4F",
            fontSize: 16,
            lineHeight: 21,
          },
        },
        grid: DefaultGrid,
        ...(option.value || {}),
      };
    });

    function onClicked(e: any) {
      emit("click", e);
    }

    function onHighlighted(e: any) {
      emit("highlight", e);
    }

    function onMouseOvered(e: any) {
      emit("mouseover", e);
    }

    function onMouseOuted(e: any) {
      emit("mouseout", e);
    }

    function onMouseMoved(e: any) {
      emit("mousemove", e);
    }

    function resize() {
      if (!chartComp.value) return;
      chartComp.value.resize();
    }

    return {
      chartComp,
      loadingOptions,
      formatedOption,
      onClicked,
      onHighlighted,
      onMouseOvered,
      onMouseOuted,
      onMouseMoved,
      resize,
    };
  },
});
</script>

<style lang="stylus">
.chart
  @apply flex w-full h-52 min-h-52 overflow-hidden
</style>
