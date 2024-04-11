<template lang="pug">
.download-button(
  :class='{ disabled }'
  ref="buttonEl"
  data-skip-download
)
  a.download-button-toggle(
    href="javascript:;"
    @click="onClickedToggle"
  )
    SLElementWithTitle(title="下載")
      SLIcon(icon="download")
  ClientOnly
    Teleport(to="body")
      .download-button-popup(ref="popupEl")
        a.download-option(
          v-if="sheets"
          href="javascript:;"
          @click="onClickedOption('excel')"
        ) Excel (.xlsx)
        a.download-option(
          v-if="imageTarget"
          href="javascript:;"
          @click="onClickedOption('png')"
        ) 圖片 (.png)
</template>

<script lang="ts">
import type { PropType } from "vue";
import { fromEvent, Subscription } from "rxjs";
import { createPopper } from "@popperjs/core";
import type { Instance as PopperInstance, Placement } from "@popperjs/core";
import * as htmlToImage from "html-to-image";
import ExcelJS from "exceljs";
import {
  formatDateRange,
  downloadURL,
  downloadBlob,
  gaev,
  ga4ev,
} from "~ui/utils";
import type IDateRange from "~ui/interface/IDateRange";
import watermarkImg from "~uiAssets/images/commons/watermark.svg";

// http://www.excelcodex.com/2012/06/worksheets-naming-conventions/
function safeSheetName(name: string) {
  return name.replace(/[\\/*?:[\]]/g, "").substring(0, 31);
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = url;
  });
}

const DEFAULT_STYLE = {
  marginTop: 0,
  marginBottom: 9,
  border: 0,
};

export default defineComponent({
  name: "SLDownloadButton",
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String as PropType<Placement>,
      default: "bottom-end",
    },
    fileName: {
      type: String,
      default: "",
    },
    sheets: {
      type: Array as PropType<
        Array<{
          sheetName: string;
          sheetData: Array<Array<string | number>>;
        } | null>
      >,
      default: null,
    },
    imageTarget: {
      type: Object as PropType<HTMLElement | null>,
      default: () => null,
    },
    dateRanges: {
      type: Array as PropType<(IDateRange | null)[]>,
      default: () => [],
    },
    padding: {
      type: Number,
      default: 0,
    },
    watermark: {
      type: Boolean,
      default: true,
    },
    customFilter: {
      type: Function,
      default: null,
    },
    customStyle: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => {},
    },
    evCategory: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const {
      disabled,
      placement,
      fileName,
      sheets,
      imageTarget,
      dateRanges,
      padding,
      watermark,
      customFilter,
      customStyle,
      evCategory,
    } = toRefs(props);

    const buttonEl = shallowRef<HTMLElement | null>(null);
    const popupEl = shallowRef<HTMLElement | null>(null);

    let clickSubscriber: Subscription | null = null;
    let popperInstance: PopperInstance | null = null;

    const styleOption = computed(() => {
      return Object.assign({}, DEFAULT_STYLE, customStyle.value);
    });
    const filterOption = computed(() => {
      return (node: HTMLElement) => {
        return (
          !(
            node?.getAttribute && node.getAttribute("data-skip-download") === ""
          ) &&
          (typeof customFilter.value !== "function" ||
            (customFilter.value && customFilter.value(node)))
        );
      };
    });

    function subscribeClick() {
      clickSubscriber = fromEvent(window, "click").subscribe((e) => {
        const { target } = e;
        if (buttonEl.value && !buttonEl.value.contains(target as Element)) {
          hide();
        }
      });
    }

    function unsubscribeClick() {
      if (clickSubscriber) {
        clickSubscriber.unsubscribe();
      }
      clickSubscriber = null;
    }

    function show() {
      if (!popupEl.value || !popperInstance) return;

      subscribeClick();
      popupEl.value.setAttribute("data-show", "");

      popperInstance.setOptions({
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
          { name: "eventListeners", enabled: true },
        ],
      });

      popperInstance.update();
    }

    function hide() {
      if (
        !popupEl.value ||
        popupEl.value.getAttribute("data-show") === null ||
        !popperInstance
      ) {
        return;
      }

      unsubscribeClick();
      popupEl.value.removeAttribute("data-show");
      popperInstance.setOptions({
        modifiers: [{ name: "eventListeners", enabled: false }],
      });
    }

    function onClickedToggle(e: Event) {
      e.stopPropagation();
      if (disabled.value) return;

      if (!popupEl.value || popupEl.value.getAttribute("data-show") !== null) {
        hide();
        return;
      }
      show();
    }

    async function onClickedOption(option: string) {
      hide();

      if (option === "excel") {
        if (evCategory.value !== "") {
          gaev({
            category: evCategory.value,
            action: "click",
            label: "下載 Excel",
          });
          ga4ev({
            category: evCategory.value,
            action: `${evCategory.value}-下載 Excel`,
            label: "下載 Excel",
          });
        }
        const workbook = new ExcelJS.Workbook();
        sheets.value.map((sheetData) => {
          const sheet = workbook.addWorksheet(
            sheetData?.sheetName ? safeSheetName(sheetData.sheetName) : ""
          );
          (sheetData?.sheetData || []).forEach((rowData) => {
            sheet.addRow(rowData);
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        downloadBlob(
          buffer,
          `${fileName.value}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        return;
      }

      if (!imageTarget.value) {
        console.log("Can not find target of htmlToImage!");
        return;
      }

      if (evCategory.value !== "") {
        gaev({
          category: evCategory.value,
          action: "click",
          label: "下載圖片",
        });
        ga4ev({
          category: evCategory.value,
          action: `${evCategory.value}-下載圖片`,
          label: "下載圖片",
        });
      }

      const options = {
        pixelRatio: 1,
        filter: filterOption.value,
        style: styleOption.value,
      };

      let dataURL = await htmlToImage.toPng(imageTarget.value, options);
      if (padding.value) dataURL = await addPadding(dataURL, padding.value);
      if (dateRanges.value?.length > 0)
        dataURL = await addDateRanges(dataURL, [...dateRanges.value].reverse());
      if (watermark.value) dataURL = await addWatermark(dataURL, watermarkImg);
      downloadURL(dataURL, `${fileName.value}.png`);
    }

    async function addPadding(dataURL: string, padding: number) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      const img = await loadImage(dataURL);
      const { width, height } = img;
      canvas.width = width + padding * 2;
      canvas.height = height + padding * 2;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);

      return canvas.toDataURL();
    }

    async function addDateRanges(
      dataURL: string,
      dateRanges: (IDateRange | null)[]
    ) {
      const fontSize = 16;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      const img = await loadImage(dataURL);
      const { width, height } = img;
      canvas.width = width;
      canvas.height = height + fontSize * 3;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const text = `時間區間：${dateRanges
        .filter((dateRange) => !!dateRange)
        .map((dateRange) => formatDateRange(dateRange))
        .join(" v.s. ")}`;
      ctx.fillStyle = "#333333";
      ctx.font = `${fontSize}px "Microsoft JhengHei"`;
      ctx.fillText(text, fontSize, canvas.height - fontSize);

      return canvas.toDataURL();
    }

    async function addWatermark(dataURL: string, watermarkImg: any) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      const img = await loadImage(dataURL);
      const watermark = await loadImage(watermarkImg);

      const { width, height } = img;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const matrix = new DOMMatrix();
      const pattern = ctx.createPattern(watermark, "repeat");
      if (!pattern) return "";

      pattern.setTransform(matrix.rotate(-20).scale(0.5));
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      return canvas.toDataURL();
    }

    onMounted(() => {
      nextTick(() => {
        if (buttonEl.value && popupEl.value) {
          popperInstance = createPopper(buttonEl.value, popupEl.value, {
            placement: placement.value,
            modifiers: [{ name: "eventListeners", enabled: false }],
          });
        }
      });
    });

    onBeforeUnmount(() => {
      if (popperInstance) {
        popperInstance.destroy();
      }
      popperInstance = null;
    });

    return {
      buttonEl,
      popupEl,
      onClickedToggle,
      onClickedOption,
    };
  },
});
</script>

<style lang="stylus">
.download-button
  @apply inline-block

  &.disabled
    .download-button-toggle
      @apply border-cancel text-cancel cursor-default

  &-toggle
    @apply inline-flex justify-center items-center s('w-[28px]') s('h-[28px]') bg-white border border-primary-hover rounded text-lg text-primary-hover

    &.active
      @apply bg-primary-hover text-white

.download-button-popup
  @apply z-60 absolute flex flex-col bg-white border border-primary-light rounded overflow-hidden shadow invisible pointer-events-none

  &[data-show]
    @apply visible pointer-events-auto

  .download-option
    @apply block p-2 bg-white text-sm text-gray-3
    @apply s('hover:bg-bg') s('hover:text-primary')
</style>
