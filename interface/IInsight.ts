import type IDateRange from "./IDateRange";
import type { IWebOverlap, IWebVisitDetailResponse, IWebLocationDetailCityResponse, IWebOverlapResponse, IWebTopsiteDetailSiteResponse } from "./IWeb";

export enum InsightTopicStatus {
  Normal = 'normal',
  Coming = 'coming',
}

export interface IInsightTopicResponse {
  title1?: string;
  title2?: string;
  topic_id?: string;
  year_month?: string[];
  status: InsightTopicStatus;
}

export interface IInsightTopic {
  id: string;
  mainCategory: string;
  subCategory: string;
  months: IDateRange[][];
  status: InsightTopicStatus;
}

export interface IInsightDomainSetting {
  name: string;
  name2: string;
  groups: { name: string, domain: string }[];
}

export interface IInsightPOISetting {
  name: string;
  name2: string;
  groups: { name: string, pg_id: string, poi_count: number }[];
}

export interface IInsightSetting {
  domains: IInsightDomainSetting[];
  pois: IInsightPOISetting[];
}

export interface IInsightWebCities {
  domain: string;
  data: IWebLocationDetailCityResponse[];
}

export interface IInsightWebTraffic {
  domain: string;
  data: { date: string, cnt: number, pv: number }[];
}

export interface IInsightDomainData {
  name: string;
  name2: string;
  uu: number;
  overlap: IWebOverlapResponse[];
  profile: IWebVisitDetailResponse;
  cities: IInsightWebCities[];
  traffic: IInsightWebTraffic[];
  topsites: IWebTopsiteDetailSiteResponse[];
  toppois: { name: string, cnt: number, poi_count: number }[];
}

export interface IInsightPOIProfileData {
  cnt: number;
  male: number;
  female: number;
  age1: number;
  age2: number;
  age3: number;
  age4: number;
  age5: number;
  age6: number;
  age7: number;
  age8: number;
  age1_male: number;
  age2_male: number;
  age3_male: number;
  age4_male: number;
  age5_male: number;
  age6_male: number;
  age7_male: number;
  age8_male: number;
  age1_female: number;
  age2_female: number;
  age3_female: number;
  age4_female: number;
  age5_female: number;
  age6_female: number;
  age7_female: number;
  age8_female: number;
}

export interface IInsightPOICities {
  name: string;
  data: IWebLocationDetailCityResponse[];
}

export interface IInsightPOITraffic {
  name: string;
  color: string;
  data: { date: string, cnt: number, poi_count: number }[];
}

export interface IInsightPOIData {
  name: string;
  name2: string;
  uu: number;
  profile: IInsightPOIProfileData;
  cities: IInsightPOICities[];
  traffic: IInsightPOITraffic[];
  topsites: IWebTopsiteDetailSiteResponse[];
  toppois: { name: string, cnt: number, poi_count: number }[];
}

export interface IInsightData {
  domains: IInsightDomainData[];
  pois: IInsightPOIData[];
}

export interface IInsightResponse {
  domains_setting_changed?: boolean;
  pois_setting_changed?: boolean;
  setting?: IInsightSetting;
  prev_setting?: IInsightSetting;
  summaries?: string[];
  data?: IInsightData;
  prev_data?: IInsightData;
}

export interface IInsightGroupItem {
  domain?: string;
  pg_id?: string;
  name: string;
  poi_count?: number;
  color: string;
  overlap: Array<IWebOverlap[]>;
  cities: Array<IWebLocationDetailCityResponse[] | null>;
  traffic: Array<{ date: string, cnt: number, pv: number }[] | null>;
  cnt?: number;
  diff: number;
}

export interface IInsightGroup {
  name: string;
  name2: string;
  desc: string;
  uu: number[];
  profile: Array<IWebVisitDetailResponse | null>;
  topsites: Array<{ domain: string, name: string, itype1: string, itype2: string, cnt: number }[] | null>,
  items: IInsightGroupItem[];
}

export interface IInsightRankedGroupItem extends IInsightGroupItem {
  rank: number;
}

export interface IInsightFormatedGroupItem {
  domain?: string;
  pg_id?: string;
  name: string;
  poi_count?: number,
  color: string;
  type1?: string;
  type2?: string;
  tags?: string[];
  cnt1?: number;
  cnt2?: number;
  rate1?: number;
  rate2?: number;
  rank?: number;
  rankDiff?: number;
  cnt: number[];
  dailyCnt: Array<{ date: string, cnt: number, pv: number }[] | null>;
  overlap: Array<IWebOverlap[] | null>;
}

export interface IInsightRankedFormatedGroupItem extends IInsightFormatedGroupItem {
  rank: number;
}