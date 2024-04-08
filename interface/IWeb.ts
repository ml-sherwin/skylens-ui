export enum OnlineSourceType {
  All,
  Cable,
  Mobile,
}

export type OnlineResultType<T> = {
  data1: Array<T> | null;
  data2: Array<T> | null;
  // [key: string]: Array<T> | null;
}

interface IWebBasicResponse {
  domain: string;
  name: string;
  industry_tags: string[];
  itype1: string;
  itype2: string;
  attrs: string[];
}

export interface IWebLocationDetailCityResponse {
  name: string;
  cnt: number;
}

interface IWebOverlapDetailResponse {
  date: string;
  cnt: Array<number>;
  pv: Array<number>;
}

export interface IWebOverlapResponse extends IWebBasicResponse {
  data: Array<IWebOverlapDetailResponse>;
}

export interface IWebTopsiteDetailSiteResponse {
  domain: string;
  name: string;
  itype1: string;
  itype2: string;
  industry_tags: Array<string>;
  domain_group: string;
  cnt: number;
  pv: number;
}

export interface IWebVisitDetailAgeProfileResponse {
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

export interface IWebVisitDetailResponse extends IWebVisitDetailAgeProfileResponse {
  date: string;
  pv: number;
  cnt: number;
  male: number;
  female: number;
}

interface ICityTrafficResponse {
  name: string;
  cnt: number;
}

interface ILocationDetailResponse {
  date: string;
  cities: ICityTrafficResponse[];
}

interface ITopsiteTrafficResponse {
  domain: string;
  name: string;
  itype1: string;
  itype2: string;
  industry_tags: string[];
  domain_group: string;
  cnt: number;
  pv: number;
}

interface ITopsiteDetailResponse {
  date: string;
  sites: ITopsiteTrafficResponse[];
}

interface IOverlapDetailResponse {
  date: string;
  cnt: number[];
  pv: number[];
}

export interface IWebVisitResponse extends IWebBasicResponse {
  data: IWebVisitDetailResponse[];
}

export interface IWebLocationResponse extends IWebBasicResponse {
  data: ILocationDetailResponse[];
}

export interface IWebTopsiteResponse extends IWebBasicResponse {
  data: ITopsiteDetailResponse[];
}

export interface IWebOverlapReponse extends IWebBasicResponse {
  data: IOverlapDetailResponse[];
}

interface IWebBasic {
  domain: string;
  name: string;
  color: string;
  itype1?: string;
  itype2?: string;
  attrs?: string[];
}

interface IWebVisitAge {
  name: string;
  visitors: number;
  male: number;
  female: number;
}

export interface IWebVisitGenderProfile {
  male: number;
  female: number;
}

export interface IWebVisitAgeProfile {
  age1: IWebVisitAge;
  age2: IWebVisitAge;
  age3: IWebVisitAge;
  age4: IWebVisitAge;
  age5: IWebVisitAge;
  age6: IWebVisitAge;
  age7: IWebVisitAge;
  age8: IWebVisitAge;
}

export interface IWebVisit extends IWebBasic, IWebVisitGenderProfile, IWebVisitAgeProfile {
  visitors: number;
  pageviews: number;
  daily: IWebVisitDetailResponse[];
}

export interface IWebVisitFormatedSite extends IWebBasic {
  age1: Array<number>;
  age2: Array<number>;
  age3: Array<number>;
  age4: Array<number>;
  age5: Array<number>;
  age6: Array<number>;
  age7: Array<number>;
  age8: Array<number>;
}

export type IWebVisitAgeProfileKeyType = keyof IWebVisitAgeProfile;

export interface IWebLocationDetailCity {
  name: string;
  visitors: number;
  visitorsDisplay: string;
  rate: number;
  rageDisplay: string;
  rank: number;
}

export interface IWebLocation extends IWebBasic {
  cities: Array<IWebLocationDetailCity>;
  sum: number;
  rate: number;
  rank: number;
}

export interface IWebTopsiteSite {
  domain: string;
  name: string;
  type1: string;
  type2: string;
  tags: Array<string>;
  group: string;
  visitors: number;
  visitorsPercentage: number;
  pageviews: number;
  sumTimes: number;
  rank: number;
  reach: number;
}

export interface IWebTopsiteTag {
  name: string;
  visitors: number;
  pageviews: number;
  websites: IWebTopsiteSite[];
  brands: number[];
  reach: number;
  rank: number;
  visitorsPercentage: number;
}

export interface IWebTopsite extends IWebBasic {
  sites: Array<IWebTopsiteSite>;
  type1: string;
  type2: string;
  types1: IWebTopsiteTag[];
  types2: IWebTopsiteTag[];
  tags: IWebTopsiteTag[];
}

export interface IWebTopsiteTagBrand extends IWebTopsite {
  data: OnlineResultType<IWebTopsiteTag>;
  visitors: Array<number>;
}

export interface IWebOverlap extends IWebBasic {
  visitors: number;
  overlaps: Array<IWebOverlap>;
}

export interface IWebOverlapBrandOverlap extends IWebOverlap {
  tags: Array<string>,
  overlapVisitors: number;
  overlapPercentage: number;
}

export interface IWebOverlapBrand extends IWebBasic {
  visitors: Array<number>;
  tags: Array<string>;
  absOverlap: Array<Array<IWebOverlapBrandOverlap>>;
  overlap: Array<Array<IWebOverlapBrandOverlap>>;
}

export interface IWebVisitFormatedSiteAge {
  age1?: Array<number>;
  age2?: Array<number>;
  age3?: Array<number>;
  age4?: Array<number>;
  age5?: Array<number>;
  age6?: Array<number>;
  age7?: Array<number>;
  age8?: Array<number>;
}

export interface IWebLocationBrand extends IWebBasic {
  cities: Array<Array<IWebLocationDetailCity>>;
}

export interface IWebLocationFormatedBrand extends IWebLocationBrand {
  visitors: Array<number>;
  visitorsDisplay: Array<string>;
}

export interface IWebRankResponse {
  domain: string;
  name: string;
  domain_group: string;
  itype1: string;
  itype2: string;
  attrs: string[];
  cnt: number;
  total: number;
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
  percent: number;
}

export interface IWebRank {
  domain: string;
  name: string;
  group: string;
  itype1: string;
  itype2: string;
  attrs: string[];
  visitors: number;
  targetVisitors: number;
  male: number;
  female: number;
  age1: {
      visitors: number;
      male: number;
      female: number;
  };
  age2: {
      visitors: number;
      male: number;
      female: number;
  };
  age3: {
      visitors: number;
      male: number;
      female: number;
  };
  age4: {
      visitors: number;
      male: number;
      female: number;
  };
  age5: {
      visitors: number;
      male: number;
      female: number;
  };
  age6: {
      visitors: number;
      male: number;
      female: number;
  };
  age7: {
      visitors: number;
      male: number;
      female: number;
  };
  age8: {
      visitors: number;
      male: number;
      female: number;
  };
  percent: number;
}
