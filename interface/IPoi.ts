import type IDateRange from "./IDateRange";

export enum PoiGroupType {
  Default = 1,
  Custom,
}

export enum PoiStatus {
  Loading = 'loading',
  Tracking = 'tracking',
  Untrack = 'untrack',
}

export enum PoiReportType {
  Sum = 'sum',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export enum PoiTopsitesStatus {
  Run = 'run',
  Error = 'error',
  Complete = 'complate',
}

export type OfflineCustomResultType<T> = {
  [key: string]: Array<T> | null;
}

export interface IPoiProfileDetailAgeResponse {
  age1: number;
  age2: number;
  age3: number;
  age4: number;
  age5: number;
  age6: number;
  age7: number;
  age8: number;
  age1_male: number;
  age1_female: number;
  age2_male: number;
  age2_female: number;
  age3_male: number;
  age3_female: number;
  age4_male: number;
  age4_female: number;
  age5_male: number;
  age5_female: number;
  age6_male: number;
  age6_female: number;
  age7_male: number;
  age7_female: number;
  age8_male: number;
  age8_female: number;
}

export interface IPoiProfileDetailResponse extends IPoiProfileDetailAgeResponse {
  date: string;
  poi_count: number;
  cnt: number;
  male: number;
  female: number;
}

export interface IPoiProfileResponse {
  pg_id: string;
  data: IPoiProfileDetailResponse[];
}

export interface IPoiTrafficDetailResponse {
  cnt_total: number;
  date: string;
  hour_cnt: number[];
  hour_m: number[];
  hour_m_avg: number[];
  m_avg: number;
  m_total: number;
  poi_count: number;
}

export interface IPoiTrafficResponse {
  pg_id: string;
  data: IPoiTrafficDetailResponse[];
}

interface IPoiTopsitesDetailSiteResponse {
  domain: string;
  name: string;
  itype1: string;
  itype2: string;
  industry_tags: string[];
  domain_group: string;
  cnt: number;
  pv: number;
}

interface IPoiTopsitesDetailResponse {
  date: string;
  poi_count: number;
  sites: IPoiTopsitesDetailSiteResponse[];
}

export interface IPoiTopsitesResponse {
  pg_id: string;
  data: IPoiTopsitesDetailResponse[];
}

export interface IPoiGroupResponse {
  pg_id: string;
  name: string;
  type: PoiGroupType;
  poi_count: number;
  poi_actived: number;
  data_date: string;
  pois: {
    created_at: number;
    data_date: string;
    latlon: string;
    poi_id: string;
  }[];
}

export interface IPoiGroup {
  id: string;
  pgId: string;
  name: string;
  type: PoiGroupType;
  poiCount: number;
  poiActived: number;
  dataDate: Date | null;
  unaccessable?: boolean;
}

export interface IFormatedPoiGroup {
  id: string;
  pgId: string;
  name: string;
  type: PoiGroupType;
  poiCount: number;
  poiActived: number;
  dataDate: string;
}

// type 為 PoiGroupType.Default 時 name 和 pg_id 必填且同值
// type 為 PoiGroupType.Custom 時 pg_id 及 latlons 擇一
export interface IPoiResourceInput {
  name: string;
  type: PoiGroupType;
  pg_id?: string;
  latlons?: string[];
}

export interface IMapPoi {
  latlon: string;
  lat: string;
  lon: string;
  status: PoiStatus;
  dataDate: Date | null;
}

export interface IInputPoi {
  latlon: string;
  lat: string;
  lon: string;
  status: PoiStatus;
  dataDate: Date | null;
}

export interface IInputPoiGroup {
  id: string;
  pgId?: string;
  type: PoiGroupType;
  name: {
    value: string;
    invalidFeedback: string;
  };
  poiActived?: number;
  poiCount?: number;
  pois?: IInputPoi[];
  dataDate: Date | null;
  isNew?: boolean;
}

export interface IFormatedInputPoiGroup {
  id: string;
  pgId?: string;
  type: PoiGroupType;
  name: {
    value: string;
    invalidFeedback: string;
  };
  poiActived?: number;
  poiCount?: number;
  pois?: IInputPoi[];
  dataDate: string;
  isNew?: boolean;
}

export interface IPoiProfile {
  id: string;
  name: string;
  color: string;
  daily: Array<IPoiProfileDetailResponse>;
  weekly: Array<IPoiProfileDetailResponse>;
  monthly: Array<IPoiProfileDetailResponse>;
}

export interface IFormatedPoiProfile {
  id: string;
  name: string;
  color: string;
  daily: Array<Array<IPoiProfileDetailResponse>>;
  poiActived: number;
}

interface IPoiProfileWeeklyDetail extends IPoiProfileDetailResponse {
  week: string;
  dateRange: IDateRange;
}

interface IPoiProfileMonthlyDetail extends IPoiProfileDetailResponse {
  month: string;
  dateRange: IDateRange;
}

export interface IFormatedPoiPCProfile {
  id: string;
  name: string;
  color: string;
  daily: Array<Array<IPoiProfileDetailResponse>>;
  weekly: Array<Array<IPoiProfileWeeklyDetail>>;
  monthly: Array<Array<IPoiProfileMonthlyDetail>>;
}

export interface IFormatedCustomPoiCategoryAgeProfile {
  age1: { name: string; visitors: number[]; male: number[]; female: number[]; };
  age2: { name: string; visitors: number[]; male: number[]; female: number[]; };
  age3: { name: string; visitors: number[]; male: number[]; female: number[]; };
  age4: { name: string; visitors: number[]; male: number[]; female: number[]; };
  age5: { name: string; visitors: number[]; male: number[]; female: number[]; };
  age6: { name: string; visitors: number[]; male: number[]; female: number[]; };
  age7: { name: string; visitors: number[]; male: number[]; female: number[]; };
  age8: { name: string; visitors: number[]; male: number[]; female: number[]; };
}

export interface IForamtedCustomPoiCategory extends IFormatedCustomPoiCategoryAgeProfile {
  name: string;
  color: string;
  poiCount: number[];
  visitors: number[];
  male: number[];
  female: number[];
  dailyPC: Array<Array<IPoiProfileDetailResponse>>;
  weeklyPC: Array<Array<IPoiProfileWeeklyDetail>>;
  monthlyPC: Array<Array<IPoiProfileMonthlyDetail>>;
}

interface IPoiTopsitesSiteData {
  domain: string;
  name: string;
  type1: string;
  type2: string;
  tags: Array<string>;
  group: string;
  visitors: number;
  pageviews: number;
}

export interface IPoiTopsitesCategory {
  id: string;
  name: string;
  domain: string;
  sites: Array<IPoiTopsitesSiteData>;
}

export interface IPoiTraffic {
  id: string;
  name: string;
  color: string;
  daily: Array<IPoiTrafficDetailResponse>;
  weekly: Array<IPoiTrafficDetailResponse>;
  monthly: Array<IPoiTrafficDetailResponse>;
}

export interface IFormatedPoiTrafficPC {
  id: string;
  name: string;
  color: string;
  daily: Array<Array<IPoiTrafficDetailResponse>>;
  weekly: Array<IPoiTrafficDetailResponse>;
}

interface IPoiCityProfileDetailResponse extends IPoiProfileDetailAgeResponse {
  name: string;
  poi_count: number;
  cnt: number;
  male: number;
  female: number;
}

interface IPoiCityDateResponse {
  date: string;
  cities: IPoiCityProfileDetailResponse[];
}

export interface IPoiCategoryCitiesProfileResponse {
  pg_id: string;
  data: IPoiCityDateResponse[];
}

export interface IPoiCitiesDistributionResponse {
  pg_id: string;
  data: {
    name: string;
    poi_count: number;
  }[];
}

export interface IPoiCitiesDistribution {
  pgId: string;
  cities: {
    name: string;
    count: number;
  }[];
}

export interface IPoiLatlonProfilePercentInput {
  pois: {
    pg_id: string;
    type: PoiGroupType;
  }[];
  city?: string;
  startdate: string;
  enddate: string;
  report: PoiReportType;
}

export interface IPoiLatlonProfilePercentResponse {
  pg_id: string;
  latlons: string[],
  data: {
    date: string;
    cnt: number[];
    male: number[];
    female: number[];
    age1: number[];
    age2: number[];
    age3: number[];
    age4: number[];
    age5: number[];
    age6: number[];
    age7: number[];
    age8: number[];
    age1_male: number[];
    age1_female: number[];
    age2_male: number[];
    age2_female: number[];
    age3_male: number[];
    age3_female: number[];
    age4_male: number[];
    age4_female: number[];
    age5_male: number[];
    age5_female: number[];
    age6_male: number[];
    age6_female: number[];
    age7_male: number[];
    age7_female: number[];
    age8_male: number[];
    age8_female: number[];
  }[];
}

export interface IPoiLatlonProfilePercentAgeDetail {
  value: number;
  male: number;
  female: number;
}

export interface IPoiLatlonProfilePercentAge {
  age1: IPoiLatlonProfilePercentAgeDetail;
  age2: IPoiLatlonProfilePercentAgeDetail;
  age3: IPoiLatlonProfilePercentAgeDetail;
  age4: IPoiLatlonProfilePercentAgeDetail;
  age5: IPoiLatlonProfilePercentAgeDetail;
  age6: IPoiLatlonProfilePercentAgeDetail;
  age7: IPoiLatlonProfilePercentAgeDetail;
  age8: IPoiLatlonProfilePercentAgeDetail;
}

export interface IPoiLatlonProfilePercent extends IPoiLatlonProfilePercentAge {
  latlon: string;
  cnt: number;
  male: number;
  female: number;
}



export interface IPoiActivedCheck {
  status: 'run' | 'complete';
  diff?: number;
  count?: number;
  dataDate?: string;
}

export interface IPoiIsActivedResponse {
  poi_id?: string;
  latlon?: string;
  created_at?: number;
  data_date?: string;
}

export interface IPoiCategoryResponse {
  name?: string;
  count?: number;
  children?: Array<IPoiCategoryResponse>;
}

interface IPoiCitiesProfileDateResponse {
  date?: string;
  cities?: Array<IPoiCityProfileDetailResponse>
}

interface IPoiCityProfileDate extends IPoiCityProfileDetailResponse {
  date: string;
}

export interface IPoiCityProfile {
  name: string;
  daily?: Array<IPoiCityProfileDate>;
  weekly?: Array<IPoiCityProfileDate>;
  monthly?: Array<IPoiCityProfileDate>;
}

export interface IPoiCitiesProfile {
  id: string;
  name: string;
  color: string;
  daily?: Array<IPoiCitiesProfileDateResponse>;
  weekly?: Array<IPoiCitiesProfileDateResponse>;
  monthly?: Array<IPoiCitiesProfileDateResponse>;
  countries?: Array<IPoiCityProfile>;
}

export interface IPoiFormatedCitiesProfileCountry {
  name: string;
  totalVisitors: number;
  rate?: number;
  rank?: number;
}

export interface IPoiFormatedCitiesProfile {
  id: string;
  name: string;
  color: string;
  data: Array<Array<IPoiCityProfile>>;
  visitors?: Array<number>;
  countries?: Array<Array<IPoiFormatedCitiesProfileCountry>>
  regions?: Array<Array<{
      name: string,
      visitors: number,
      countries: Array<string>,
  }>>
}

export interface IFormatedPoiTraffic {
  name: string;
  color: string;
  daily: Array<Array<IPoiTrafficDetailResponse>>;
}
