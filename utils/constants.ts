import type { IDashboardWidget, IDashboardBlock } from '~ui/interface/IDashboard';
import { DashboardWidgetSourceType, DashboardWidgetSize } from '~ui/interface/IDashboard';

export const AGE_RANGE_NAME = [
  '17以下',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65-74',
  '75以上',
];

export const WEB_CHART_COLORS = [
  "#8677b6",
  "#6be6c1",
  "#626c91",
  "#688ed0",
  "#6ccadd",
  "#2ca5b9",
  "#3364d2",
  "#15625a",
  "#a3e26a",
  "#3ed6dd",
  "#7c9a84",
  "#c9df7f",
  "#5c5cdf",
  "#31cb9a",
  "#6e717e",
  "#eccc65",
  "#6c907c",
  "#6a8ef6",
  "#57e5f1",
  "#6022d2",
  "#98c8c8",
  "#c3c350"
];

export const POI_CHART_COLORS = [
  "#df7bae",
  "#f1a29a",
  "#9c7fd0",
  "#e2b587",
  "#c3cd75",
  "#7e4e77",
  "#c36c34",
  "#e2a5cc",
  "#efce4a",
  "#60c0dd",
  "#e47272",
  "#c7b8c8",
  "#d590d8",
  "#be5291",
  "#ef7f24",
  "#a9a1e9",
  "#9d6fc6",
  "#dfb9b9",
  "#e75151",
  "#ba92c1",
  "#63caae",
  "#b65f5f"
];

export const VISUAL_MAP_CONTINUOUS_COLORS = ['#90C9E9', '#91E2B4', '#FEE99D', '#FE8678'];

export const GEO_VISUAL_MAP_CONTINUOUS_COLORS = ['#FEFFEF', '#E4EDAD', '#297CDE', '#610AD0'];

export const VISUAL_MAP_PIECEWISE_COLORS = [
  '#90C9E9',
  '#AAD9F3',
  '#B8E5F3',
  '#D2F4FB',
  '#E8FDFD',
  '#E4FCF0',
  '#D7FCDC',
  '#C1F6CD',
  '#ACF0C2',
  '#91E2B4',
  '#B2E4AD',
  '#D1E6A6',
  '#E2E7A2',
  '#FEF0B5',
  '#FEE99D',
  '#FED696',
  '#FEC48F',
  '#FEAE87',
  '#FE997F',
  '#FE8678',
];

export const GEO_VISUAL_MAP_PIECEWISE_COLORS = [
  '#FBFDE7',
  '#F5F9D8',
  '#EFF5C8',
  '#E4EEB6',
  '#B6DDEE',
  '#88C1E0',
  '#4B8CCF',
  '#3F6BCE',
  '#4D4DC7',
  '#5528AA',
];

export const MIN_VISUAL_MAP_PIECEWISE_COLORS = [
  '#90C9E9',
  '#AAD9F3',
  '#D2F4FB',
  '#E8FDFD',
  '#D7FCDC',
  '#ACF0C2',
  '#91E2B4',
  '#B2E4AD',
  '#E2E7A2',
  '#FEF0B5',
  '#FEE99D',
  '#FEC48F',
  '#FEAE87',
  '#FE8678',
];

export const ROLE = {
  su: {
    name: {
      default: '最高管理員',
      zh: '最高管理員',
    },
    color: 'secondary-line',
  },
  sys_admin: {
    name: {
      default: '系統管理員',
      zh: '系統管理員',
    },
    color: 'primary-hover',
  },
  user: {
    name: {
      default: '一般使用者',
      zh: '一般使用者',
    },
    color: 'third-7',
  },
};

export const DEFAULT_END_DATE_BEFORE_NOW = 3;

export const TAIWAN_COUNTRIES = [
  '台北市',
  '新北市',
  '桃園市',
  '台中市',
  '台南市',
  '高雄市',
  '基隆市',
  '新竹市',
  '嘉義市',
  '新竹縣',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義縣',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '台東縣',
  '澎湖縣',
  '金門縣',
  '連江縣',
];

export const TAIWAN_AREAS = {
  '基隆市': ["信義區","中正區","中山區","安樂區","仁愛區","暖暖區","七堵區"],
  '台北市': ["中正區","大同區","中山區","松山區","大安區","萬華區","信義區","士林區","北投區","內湖區","南港區","文山區"],
  '新北市': ["萬里區","金山區","板橋區","汐止區","深坑區","石碇區","瑞芳區","平溪區","雙溪區","貢寮區","新店區","坪林區","烏來區","永和區","中和區","土城區","三峽區","樹林區","鶯歌區","三重區","新莊區","泰山區","林口區","蘆洲區","五股區","八里區","淡水區","三芝區","石門區"],
  '桃園市': ["中壢區","平鎮區","龍潭區","楊梅區","新屋區","觀音區","桃園區","龜山區","八德區","大溪區","復興區","大園區","蘆竹區"],
  '新竹市': ["東區","北區","香山區",],
  '新竹縣': ["竹北市","湖口鄉","新豐鄉","新埔鎮","關西鎮","芎林鄉","寶山鄉","竹東鎮","五峰鄉","橫山鄉","尖石鄉","北埔鄉","峨眉鄉"],
  '苗栗縣': ["竹南鎮","頭份市","三灣鄉","南庄鄉","獅潭鄉","後龍鎮","通霄鎮","苑裡鎮","苗栗市","造橋鄉","頭屋鄉","公館鄉","大湖鄉","泰安鄉","銅鑼鄉","三義鄉","西湖鄉","卓蘭鎮"],
  '台中市': ["中區","東區","南區","西區","北區","北屯區","西屯區","南屯區","太平區","大里區","霧峰區","烏日區","豐原區","后里區","石岡區","東勢區","和平區","新社區","潭子區","大雅區","神岡區","大肚區","沙鹿區","龍井區","梧棲區","清水區","大甲區","外埔區","大安區"],
  '彰化縣': ["彰化市","芬園鄉","花壇鄉","秀水鄉","鹿港鎮","福興鄉","線西鄉","和美鎮","伸港鄉","員林市","社頭鄉","永靖鄉","埔心鄉","溪湖鎮","大村鄉","埔鹽鄉","田中鎮","北斗鎮","田尾鄉","埤頭鄉","溪州鄉","竹塘鄉","二林鎮","大城鄉","芳苑鄉","二水鄉"],
  '南投縣': ["南投市","中寮鄉","草屯鎮","國姓鄉","埔里鎮","仁愛鄉","名間鄉","集集鎮","水里鄉","魚池鄉","信義鄉","竹山鎮","鹿谷鄉"],
  '雲林縣': ["斗南鎮","大埤鄉","虎尾鎮","土庫鎮","褒忠鄉","東勢鄉","台西鄉","崙背鄉","麥寮鄉","斗六市","林內鄉","古坑鄉","莿桐鄉","西螺鎮","二崙鄉","北港鎮","水林鄉","口湖鄉","四湖鄉","元長鄉"],
  '嘉義市': ["東區","西區"],
  '嘉義縣': ["番路鄉","梅山鄉","竹崎鄉","阿里山鄉","中埔鄉","大埔鄉","水上鄉","鹿草鄉","太保市","朴子市","東石鄉","六腳鄉","新港鄉","民雄鄉","大林鎮","溪口鄉","義竹鄉","布袋鎮"],
  '台南市': ["中西區","東區","南區","北區","安平區","安南區","永康區","歸仁區","新化區","左鎮區","玉井區","楠西區","南化區","仁德區","關廟區","龍崎區","官田區","麻豆區","佳里區","西港區","七股區","將軍區","學甲區","北門區","新營區","後壁區","白河區","東山區","六甲區","下營區","柳營區","鹽水區","善化區","大內區","山上區","新市區","安定區"],
  '高雄市': ["新興區","前金區","苓雅區","鹽埕區","鼓山區","旗津區","前鎮區","三民區","楠梓區","小港區","左營區","仁武區","大社區","東沙群島","南沙群島","岡山區","路竹區","阿蓮區","田寮區","燕巢區","橋頭區","梓官區","彌陀區","永安區","湖內區","鳳山區","大寮區","林園區","鳥松區","大樹區","旗山區","美濃區","六龜區","內門區","杉林區","甲仙區","桃源區","那瑪夏區","茂林區","茄萣區"],
  '屏東縣': ["屏東市","三地門鄉","霧台鄉","瑪家鄉","九如鄉","里港鄉","高樹鄉","鹽埔鄉","長治鄉","麟洛鄉","竹田鄉","內埔鄉","萬丹鄉","潮州鎮","泰武鄉","來義鄉","萬巒鄉","崁頂鄉","新埤鄉","南州鄉","林邊鄉","東港鎮","琉球鄉","佳冬鄉","新園鄉","枋寮鄉","枋山鄉","春日鄉","獅子鄉","車城鄉","牡丹鄉","恆春鎮","滿州鄉"],
  '台東縣': ["台東市","綠島鄉","蘭嶼鄉","延平鄉","卑南鄉","鹿野鄉","關山鎮","海端鄉","池上鄉","東河鄉","成功鎮","長濱鄉","太麻里鄉","金峰鄉","大武鄉","達仁鄉"],
  '花蓮縣': ["花蓮市","新城鄉","秀林鄉","吉安鄉","壽豐鄉","鳳林鎮","光復鄉","豐濱鄉","瑞穗鄉","萬榮鄉","玉里鎮","卓溪鄉","富里鄉"],
  '宜蘭縣': ["宜蘭市","頭城鎮","礁溪鄉","壯圍鄉","員山鄉","羅東鎮","三星鄉","大同鄉","五結鄉","冬山鄉","蘇澳鎮","南澳鄉","釣魚台"],
  '澎湖縣': ["馬公市","西嶼鄉","望安鄉","七美鄉","白沙鄉","湖西鄉"],
  '金門縣': ["金沙鎮","金湖鎮","金寧鄉","金城鎮","烈嶼鄉","烏坵鄉"],
  '連江縣': ["南竿鄉","北竿鄉","莒光鄉","東引鄉"],
};

export const TAIWAN_REGIONS = [
  {
    name: '北部區域',
    countries: [
      '基隆市',
      '台北市',
      '新北市',
      '桃園市',
      '新竹市',
      '新竹縣',
      '宜蘭縣',
    ],
  },
  {
    name: '中部區域',
    countries: ['苗栗縣', '台中市', '彰化縣', '南投縣', '雲林縣'],
  },
  {
    name: '南部區域',
    countries: ['嘉義市', '嘉義縣', '台南市', '高雄市', '屏東縣', '澎湖縣'],
  },
  {
    name: '東部區域',
    countries: ['台東縣', '花蓮縣'],
  },
  {
    name: '金門、馬祖',
    countries: ['金門縣', '連江縣'],
  },
];

export const POI_MIN_NUMBER = 1000;

export const LatLonPattern =
  /^(-|\+)?([0-8]?\d{1}\.\d*|90\.0*|[0-8]?\d{1}|90),(-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d*)|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0*|180)$/;

export const OfflineCustomSampleFile = '自定義分類上傳範例_202100615.xlsx';

export const WeeklyDay = [
  '星期日',
  '星期ㄧ',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];

export const MAP_API_KEY = 'AIzaSyDFNjeGBtbW-BdLKMb78cUR4F_OtUl0tlg';

export const DashboardWidgets: IDashboardWidget[] = [
  {
    id: 'M01_01_Visitors',
    code: 'M01_01',
    sourceType: DashboardWidgetSourceType.Web,
    title: '網站造訪人次',
    desc: '依照流量排列各網站的總造訪數',
    icon: 'chart-bar',
    img: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.One,
    querys: ['webVisit'],
  },
  {
    id: 'M02_01_Visitors',
    code: 'M02_01',
    sourceType: DashboardWidgetSourceType.Poi,
    title: '訪客人次總數',
    desc: '造訪過指定據點的訪客人次總數',
    icon: 'chart-bar',
    img: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-poi.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.One,
    querys: ['poiProfile'],
  },
  {
    id: 'M01_01_Pageviews',
    code: 'M01_01',
    sourceType: DashboardWidgetSourceType.Web,
    title: '網頁瀏覽數',
    desc: '依照流量排列各網站的總瀏覽數',
    icon: 'chart-bar',
    img: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.One,
    querys: ['webVisit'],
  },
  {
    id: 'M02_06_StayTimes',
    code: 'M02_06',
    sourceType: DashboardWidgetSourceType.Poi,
    title: '訪客平均停留時間',
    desc: '造訪過指定據點的訪客平均停留時間',
    icon: 'chart-bar',
    img: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-poi.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.One,
    querys: ['poiTraffic'],
  },
  {
    id: 'M01_02_Ages',
    code: 'M01_02',
    sourceType: DashboardWidgetSourceType.Web,
    title: '訪客年齡分佈',
    desc: '造訪過指定網站的年齡分布',
    icon: 'chart-bar',
    img: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.One,
    querys: ['webVisit'],
  },
  {
    id: 'M02_02_Ages',
    code: 'M02_02',
    sourceType: DashboardWidgetSourceType.Poi,
    title: '訪客年齡分佈',
    desc: '造訪過指定據點的年齡分布',
    icon: 'chart-bar',
    img: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-poi.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-bar-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.One,
    querys: ['poiProfilePercent'],
  },
  {
    id: 'M01_02_Genders',
    code: 'M01_02',
    sourceType: DashboardWidgetSourceType.Web,
    title: '訪客性別佔比',
    desc: '造訪過指定網站的性別佔比',
    icon: 'chart-pie-alt',
    img: '/assets/images/dashboard/dashboard-widget-pie-chart-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-pie-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.One,
    querys: ['webVisit'],
  },
  {
    id: 'M02_02_Genders',
    code: 'M02_02',
    sourceType: DashboardWidgetSourceType.Poi,
    title: '訪客性別佔比',
    desc: '造訪過指定據點的性別佔比',
    icon: 'chart-pie-alt',
    img: '/assets/images/dashboard/dashboard-widget-pie-chart-icon-poi.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-pie-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.One,
    querys: ['poiProfile'],
  },
  {
    id: 'M02_07_DistributionHeatmap',
    code: 'M02_07',
    sourceType: DashboardWidgetSourceType.Poi,
    title: '訪客足跡熱點',
    desc: '動態提供指定據點的地理熱點圖',
    icon: 'heat-map',
    img: '/assets/images/dashboard/dashboard-widget-country-heatmap-chart-icon.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-country-heatmap-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: [],
  },
  {
    id: 'M01_03_Country',
    code: 'M01_03',
    sourceType: DashboardWidgetSourceType.Web,
    title: '縣市佔有率',
    desc: '造訪過指定網站的訪客所在地理位置',
    icon: 'list',
    img: '/assets/images/dashboard/dashboard-widget-geo-list-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-geo-list-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: ['webLocation'],
  },
  // {
  //   id: 'M02_03_Country',
  //   code: 'M02_03',
  //   sourceType: DashboardWidgetSourceType.Poi,
  //   title: '縣市佔有率',
  //   desc: '造訪過指定據點的訪客所在地理位置',
  //   icon: 'list',
  //   img: '/assets/images/dashboard/dashboard-widget-geo-list-icon-poi.png',
  //   allowSizes: [DashboardWidgetSize.Two],
  //   size: DashboardWidgetSize.Two,
  // },
  {
    id: 'M01_04_Topsites',
    code: 'M01_04',
    sourceType: DashboardWidgetSourceType.Web,
    title: '百大偏好網站',
    desc: '瞭解造訪過該網站的使用者，同時也造訪哪些網站，以列出200個網站為限。',
    icon: 'list',
    img: '/assets/images/dashboard/dashboard-widget-list-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-list-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: ['webVisit', 'webTopsite'],
  },
  {
    id: 'M02_04_Topsites',
    code: 'M02_04',
    sourceType: DashboardWidgetSourceType.Poi,
    title: '百大偏好網站',
    desc: '瞭解造訪過該據點的訪客，同時也造訪哪些網站，以列出200個網站為限。',
    icon: 'list',
    img: '/assets/images/dashboard/dashboard-widget-list-icon-poi.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-list-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: ['poiProfile', 'poiTopsite'],
  },
  {
    id: 'M01_04_IndustryType1s',
    code: 'M01_04',
    sourceType: DashboardWidgetSourceType.Web,
    title: '網站主分類',
    desc: '造訪過指定網站的訪客會去的網站主分類排名',
    icon: 'list',
    img: '/assets/images/dashboard/dashboard-widget-list-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-list-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: ['webVisit', 'webTopsite'],
  },
  {
    id: 'M02_04_IndustryType1s',
    code: 'M02_04',
    sourceType: DashboardWidgetSourceType.Poi,
    title: '網站主分類',
    desc: '造訪過指定據點的訪客會去的網站主分類排名',
    icon: 'list',
    img: '/assets/images/dashboard/dashboard-widget-list-icon-poi.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-list-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: ['poiProfile', 'poiTopsite'],
  },
  {
    id: 'M01_04_IndustryType2s',
    code: 'M01_04',
    sourceType: DashboardWidgetSourceType.Web,
    title: '網站子分類',
    desc: '造訪過指定網站的訪客會去的網站子分類排名',
    icon: 'list',
    img: '/assets/images/dashboard/dashboard-widget-list-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-list-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: ['webVisit', 'webTopsite'],
  },
  {
    id: 'M02_04_IndustryType2s',
    code: 'M02_04',
    sourceType: DashboardWidgetSourceType.Poi,
    title: '網站子分類',
    desc: '造訪過指定據點的訪客會去的網站子分類排名',
    icon: 'list',
    img: '/assets/images/dashboard/dashboard-widget-list-icon-poi.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-list-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: ['poiProfile', 'poiTopsite'],
  },
  // {
  //   id: 'M01_04_IndustryTags',
  //   code: 'M01_04',
  //   sourceType: DashboardWidgetSourceType.Web,
  //   title: '網站標籤',
  //   desc: '造訪過指定網站的訪客會去的網站標籤',
  //   icon: 'list',
  //   img: '/assets/images/dashboard/dashboard-widget-list-icon-web.png',
  //   disabledImg: '/assets/images/dashboard/dashboard-widget-list-icon-disabled.png',
  //   allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
  //   size: DashboardWidgetSize.Two,
  //   querys: ['webVisit', 'webTopsite'],
  // },
  // {
  //   id: 'M02_04_IndustryTags',
  //   code: 'M02_04',
  //   sourceType: DashboardWidgetSourceType.Poi,
  //   title: '網站標籤',
  //   desc: '造訪過指定據點的訪客會去的網站標籤',
  //   icon: 'list',
  //   img: '/assets/images/dashboard/dashboard-widget-list-icon-poi.png',
  //   disabledImg: '/assets/images/dashboard/dashboard-widget-list-icon-disabled.png',
  //   allowSizes: [DashboardWidgetSize.One, DashboardWidgetSize.Two],
  //   size: DashboardWidgetSize.Two,
  //   querys: ['poiProfile', 'poiTopsite'],
  // },
  {
    id: 'M01_05_Overlaps',
    code: 'M01_05',
    sourceType: DashboardWidgetSourceType.Web,
    title: '網站訪客重疊率',
    desc: '造訪過A網站同時也造訪B網站的訪客重疊比率',
    icon: 'heat-map',
    img: '/assets/images/dashboard/dashboard-widget-heatmap-chart-icon-web.png',
    disabledImg: '/assets/images/dashboard/dashboard-widget-heatmap-chart-icon-disabled.png',
    allowSizes: [DashboardWidgetSize.Two],
    size: DashboardWidgetSize.Two,
    querys: ['webVisit', 'webOverlap'],
  },
];

export const DefaultDashboardWidgets = [
  'M01_01_Visitors',
  'M02_01_Visitors',
  'M01_01_Pageviews',
  'M02_06_StayTimes',
  'M01_02_Ages',
  'M02_02_Ages',
  'M01_02_Genders',
  'M02_02_Genders',
  'M02_07_DistributionHeatmap',
  'M01_03_Country',
  'M01_04_Topsites',
  'M02_04_Topsites',
  'M01_04_IndustryType1s',
  'M02_04_IndustryType1s',
];

export const WidgetQueryMap = {
  webVisit: `
    web_visit(type: $type, startdate: $startdate, enddate: $enddate, daily: false, domains: $domains) {
      domain
      name
      data {
        pv
        cnt
        male
        female
        age1
        age2
        age3
        age4
        age5
        age6
        age7
        age8
        age1_female
        age1_male
        age2_male
        age2_female
        age3_male
        age4_male
        age3_female
        age4_female
        age5_male
        age5_female
        age6_male
        age6_female
        age7_male
        age7_female
        age8_male
        age8_female
      }
    },
  `,
  webLocation: `
    web_location(type: $type, startdate: $startdate, enddate: $enddate, daily: false, domains: $domains) {
      domain
      name
      data {
        cities {
          name
          cnt
        }
      }
    },
  `,
  webTopsite: `
    web_topsite(type: $type, startdate: $startdate, enddate: $enddate, daily: false, domains: $domains) {
      domain
      name
      data {
        sites {
          domain
          name
          itype1
          itype2
          industry_tags
          cnt
        }
      }
    },
  `,
  webOverlap: `
    web_overlap(type: $type, startdate: $startdate, enddate: $enddate, daily: false, domains: $domains) {
      domain
      name
      data {
        cnt
      }
    }
  `,
  poiProfile: `
    poi_profile(startdate: $startdate, enddate: $enddate, report: $report, pois: $pois, truth: false) {
      pg_id
      data {
        poi_count
        cnt
        male
        female
        age1
        age2
        age3
        age4
        age5
        age6
        age7
        age8
      }
    }
  `,
  poiProfilePercent: `
    poi_profile_percent(startdate: $startdate, enddate: $enddate, report: $report, pois: $pois) {
      pg_id
      data {
        poi_count
        cnt
        male
        female
        age1
        age2
        age3
        age5
        age4
        age6
        age7
        age8
      }
    }
  `,
  poiTraffic: `
    poi_traffic(startdate: $startdate, enddate: $enddate, report: $report, pois: $pois, truth: false) {
      pg_id
      data {
        poi_count
        m_total
        cnt_total
      }
    }
  `,
  poiTopsite: `
    poi_topsite(startdate: $startdate, enddate: $enddate, report: $report, pois: $pois) {
      pg_id
      data {
        date
        poi_count
        sites {
          domain
          name
          industry_tags
          domain_group
          itype1
          itype2
          cnt
        }
      }
    }
  `,
};

export const DefaultDashboardBlocks: IDashboardBlock[] = [
  {
    title: '線上數據',
    widgets: [
      {
        id: 'M01_01',
        code: 'M01_01',
        sourceType: DashboardWidgetSourceType.Web,
        title: '網站人次',
        desc: '依照流量排列各網站的總造訪數',
        icon: 'chart-bar',
        querys: {
          current: ['webVisit'],
          compare: ['webVisit'],
        }
      },
      {
        id: 'M01_06_Industry',
        code: 'M01_06',
        sourceType: DashboardWidgetSourceType.Web,
        title: '所屬產業佔比',
        desc: '專案網站在所屬產業的總訪次佔比及各別排名',
        icon: '',
        img: '/assets/images/dashboard/pie-chart-icon.svg',
        querys: {
          current: ['webITypeVisit', 'webVisit', 'webITypesDomainVisit'],
          compare: ['webVisit', 'webITypesDomainVisit'],
        },
      },
      {
        id: 'M01_06_Website',
        code: 'M01_06',
        sourceType: DashboardWidgetSourceType.Web,
        title: '網站表現',
        desc: '專案網站的流量成長比率象限圖表',
        icon: 'chart-scatter-smalldot',
        querys: {
          current: ['webITypesDomainVisit'],
          compare: ['webITypesDomainVisit'],
        },
      },
    ],
  },
  {
    title: '線上受眾特徵',
    widgets: [
      {
        id: 'M01_02',
        code: 'M01_02',
        sourceType: DashboardWidgetSourceType.Web,
        title: '訪客性別佔比與年齡分佈',
        desc: '造訪過專案網站的訪客性別、年齡分佈',
        icon: '',
        img: '/assets/images/dashboard/web-gender-age-chart-icon.svg',
        querys: {
          current: ['webVisit'],
          compare: ['webVisit'],
        },
      },
      {
        id: 'M01_04',
        code: 'M01_04',
        sourceType: DashboardWidgetSourceType.Web,
        title: '訪客行為特徵',
        desc: '列出專案網站訪客還會去的網站類別，與全體相較特殊的 Top 10',
        icon: 'chart-bar',
        querys: {
          all: ['globalCategories'],
          current: ['webVisit', 'webTopsites'],
        },
      },
      {
        id: 'M01_05',
        code: 'M01_05',
        sourceType: DashboardWidgetSourceType.Web,
        title: '網站訪客重疊率',
        desc: '造訪過A網站同時也造訪B網站的訪客重疊比率',
        icon: 'heat-map',
        querys: {
          current: ['webVisit', 'webOverlaps'],
          compare: ['webVisit', 'webOverlaps'],
        },
      },
      {
        id: 'M01_03',
        code: 'M01_03',
        sourceType: DashboardWidgetSourceType.Web,
        title: '縣市佔有率',
        desc: '造訪過專案網站的訪客所在地理位置',
        icon: '',
        img: '/assets/images/dashboard/map-list-chart-icon.svg',
        querys: {
          current: ['webGeography'],
          compare: ['webGeography'],
        },
      },
    ],
  },
  {
    title: '據點數據',
    widgets: [
      {
        id: 'M02_01',
        code: 'M02_01',
        sourceType: DashboardWidgetSourceType.Poi,
        title: '據點人次',
        desc: '依照流量排列各據點的總造訪數',
        icon: 'chart-bar',
        querys: {
          current: ['poiVisit'],
          compare: ['poiVisit'],
        },
      },
      {
        id: 'M02_07',
        code: 'M02_07',
        sourceType: DashboardWidgetSourceType.Poi,
        title: '訪客足跡動態',
        desc: '動態提供專案據點的地理熱點圖',
        icon: '',
        img: '/assets/images/dashboard/map-marker-chart-icon.svg',
        querys: {
          // current: ['distributionCountries', 'distributionData'],
        },
      },
    ],
  },
  {
    title: '據點受眾特徵',
    widgets: [
      {
        id: 'M02_02',
        code: 'M02_02',
        sourceType: DashboardWidgetSourceType.Poi,
        title: '訪客性別佔比與年齡分佈',
        desc: '造訪過專案據點的訪客性別、年齡分佈',
        icon: '',
        img: '/assets/images/dashboard/poi-gender-age-chart-icon.svg',
        querys: {
          current: ['poiVisitPC'],
          compare: ['poiVisitPC'],
        }
      },
      {
        id: 'M02_04',
        code: 'M02_04',
        sourceType: DashboardWidgetSourceType.Poi,
        title: '訪客行為特徵',
        desc: '列出專案據點的訪客還會去的網站類別，與全體相較特殊的 Top 10',
        icon: 'chart-bar',
        querys: {
          all: ['globalCategories'],
          current: ['poiVisit', 'poiTopsites'],
        }
      },
    ],
  },
];
