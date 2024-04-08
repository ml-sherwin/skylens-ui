export enum InsightTopicStatus {
  Normal = 'normal',
  Hide = 'hide',
  Creating = 'creating',
  Wait = 'wait',
}

export enum InsightTopicFeature {
  All = '',
  Hot = 'hot',
  Male = 'male',
  Female = 'female',
}

export enum InsightChangeType {
  None = 'none',
  New = 'new',
  Update = 'update',
}

export enum InsightTopicLabel {
  Default = '',
  ComingSoon = 'comingsoon',
  New = 'new',
}

export interface IInsightTopicDomainPreviewDataResponse {
  itype2_names: string[];
  name: string;
  name_pad: string;
  uu: number;
  uu_prev_month: number;
  uu_prev_year: number;
}

export interface IInsightTopicPoiPreviewDataResponse {
  name: string;
  name_pad: string;
  pg_ids: string[];
  uu: number;
  uu_prev_month: number;
  uu_prev_year: number;
}

export interface IInsightTopicPreviewDataResponse {
  domains: IInsightTopicDomainPreviewDataResponse[];
  pois: IInsightTopicPoiPreviewDataResponse[];
}

export interface IInsightTopicDomainSettingResponse {
  itype2_names: string[];
  name: string;
  name_pad: string;
}

export interface IInsightTopicPoiSettingResponse {
  name: string;
  name_pad: string;
  pg_ids: string[];
}

export interface IInsightTopicSettingResponse {
  domains: IInsightTopicDomainSettingResponse[];
  pois: IInsightTopicPoiSettingResponse[];
}

export interface IInsightTopicResponse {
  category: string;
  feature: InsightTopicFeature[];
  icon: string;
  keywords: string[];
  name: string;
  poi: boolean;
  preview_data: IInsightTopicPreviewDataResponse;
  setting: IInsightTopicSettingResponse;
  status: InsightTopicStatus;
  topic_id: string;
  web: boolean;
  year_month: string[];
  tag: InsightTopicLabel;
}

export interface IInsightTopicWebLayerPreviewData {
  name: string;
  namePad: string;
  subTypes: string[];
  uu: number;
  momUU: number;
  yoyUU: number;
}

export interface IInsightTopicPoiLayerPreviewData {
  name: string;
  namePad: string;
  pgIds: string[];
  uu: number;
  momUU: number;
  yoyUU: number;
}

export interface IInsightTopicPreviewData {
  webLayers: IInsightTopicWebLayerPreviewData[];
  poiLayers: IInsightTopicPoiLayerPreviewData[];
}

export interface IInsightTopicWebLayerSetting {
  name: string;
  namePad: string;
  subTypes: string[];
}

export interface IInsightTopicPoiLayerSetting {
  name: string;
  namePad: string;
  pgIds: string[];
}

export interface IInsightTopicSetting {
  webLayers: IInsightTopicWebLayerSetting[];
  poiLayers: IInsightTopicPoiLayerSetting[];
}

export interface IInsightTopic {
  code: string;
  id: string;
  category: string;
  features: InsightTopicFeature[];
  icon: string;
  keywords: string[];
  name: string;
  poi: boolean;
  previewData: IInsightTopicPreviewData;
  setting: IInsightTopicSetting;
  status: InsightTopicStatus;
  web: boolean;
  months: Date[];
  pinToTop: boolean;
  hot: boolean;
  viewable: boolean;
  tag: InsightTopicLabel;
}

export interface IInsightDomainOverlapDataResponse {
  attrs: string[];
  data: {
    cnt: number[];
    date: string;
    pv: number[];
  }[];
  domain: string;
  itype1: string;
  itype2: string;
  name: string;
}

export interface IInsightAgeProfileDataResponse {
  age1: number;
  age2: number;
  age3: number;
  age4: number;
  age5: number;
  age6: number;
  age7: number;
  age8: number;
}

export interface IInsightAgeGenderProfileDataResponse {
  age1_female: number;
  age1_male: number;
  age2_female: number;
  age2_male: number;
  age3_female: number;
  age3_male: number;
  age4_female: number;
  age4_male: number;
  age5_female: number;
  age5_male: number;
  age6_female: number;
  age6_male: number;
  age7_female: number;
  age7_male: number;
  age8_female: number;
  age8_male: number;
}

export interface IInsightProfileDataResponse extends IInsightAgeProfileDataResponse, IInsightAgeGenderProfileDataResponse {
  cnt: number;
  female: number;
  male: number;
}

export interface IInsightTopsiteDataResponse {
  attrs: string[];
  cnt: number;
  domain: string;
  domain_group: string;
  itype1: string;
  itype2: string;
  name: string;
  pv: number;
}

export interface IInsightDomainTrafficDataResponse {
  data: {
    cnt: number;
    date: string;
    pv: number;
  }[];
  domain: string;
}

export interface IInsightItypePreferDataResponse {
  domains: {
    cnt: number;
    domain: string;
    name: string;
  }[];
  name: string;
  relation_percent: number;
}

export interface IInsightDomainDataResponse {
  cities: {
    data: {
      cnt: number;
      name: string;
    }[];
    domain: string;
  }[];
  domain_count: number;
  domain_info: {
    domain: string;
    domain_group: string;
    name: string;
  }[];
  itype2_names: string[];
  itype2_prefer: IInsightItypePreferDataResponse[];
  name: string;
  overlap: IInsightDomainOverlapDataResponse[];
  profile: IInsightProfileDataResponse;
  traffic: IInsightDomainTrafficDataResponse[];
  uu: number;
}

export interface IInsightPoiTrafficDataResponse {
  data: {
    cnt: number;
    date: string;
    poi_count: number;
  }[];
  name: string;
}

export interface IInsightPoiDataResponse {
  cities: {
    data: {
      cnt: number;
      name: string;
    }[];
    name: string;
  }[];
  itype2_prefer: IInsightItypePreferDataResponse[];
  name: string;
  pg_ids: string[];
  poi_count: number;
  profile: IInsightProfileDataResponse;
  traffic: IInsightPoiTrafficDataResponse[];
  uu: number;
}

export interface IInsightDataResponse {
  domains: IInsightDomainDataResponse[];
  itype_cnt: {
    cnt: number;
    name: string;
  }[];
  itype_ec_cnt: {
    cnt: number;
    name: string;
  }[];
  pois: IInsightPoiDataResponse[];
}

export interface IInsightResponse {
  data: IInsightDataResponse;
}

export interface IInsightItypePrefer {
  domains: {
    rank: number;
    cnt: number;
    domain: string;
    name: string;
  }[];
  name: string;
  ratioDiff: number;
}

export interface IInsightWebLayer {
  domainCount: number;
  subTypes: string[];
  name: string;
  uu: number;
  traffics: {
    id: string;
    name: string;
    group: string | null;
    data: {
      date: string;
      cnt: number;
    }[]
  }[];
  profile: IInsightProfileDataResponse;
  cities: {
    data: {
      cnt: number;
      name: string;
    }[];
    id: string;
    name: string;
  }[];
  overlaps: {
    id: string;
    name: string;
    overlaps: {
      id: string;
      name: string;
      cnt: number;
    }[];
  }[];
  itypePrefer: IInsightItypePrefer[];
}

export interface IInsightPoiLayer {
  name: string;
  pgIds: string[];
  poiCount: number;
  uu: number;
  traffics: {
    id: string;
    name: string;
    group: string | null;
    data: {
      date: string;
      cnt: number;
    }[]
  }[];
  profile: IInsightProfileDataResponse;
  cities: {
    data: {
      cnt: number;
      name: string;
    }[];
    id: string;
    name: string;
  }[];
  overlaps: IInsightDomainOverlapDataResponse[];
  itypePrefer: IInsightItypePrefer[];
}

export interface IInsight {
  webLayers: IInsightWebLayer[];
  poiLayers: IInsightPoiLayer[];
  subTypesCnt: {
    cnt: number;
    name: string;
  }[];
  ecSubTypesCnt: {
    cnt: number;
    name: string;
  }[];
}

export interface IInsightChagesResponse {
  domains: {
    data: string;
    type: InsightChangeType;
  }[][];
  pois: {
    data: string;
    type: InsightChangeType;
  }[][];
}

export interface IInsightChanges {
  webLayers: Map<string, InsightChangeType>[];
  poiLayers: Map<string, InsightChangeType>[];
}

export interface IInsight6MonthUUResponse {
  poi: number[] | null;
  web: number[] | null;
  year_month: string;
}

export interface IInsightHighlightResponse {
  category: string;
  cnt: number;
  cnt_prev: number;
  core_name: string;
  data_type: 'web' | 'poi';
  icon: string;
  percent: number;
  topic_id: string;
  topic_name: string;
  year_month: string;
}

export interface IInsightHighlightsResponse {
  decrease: IInsightHighlightResponse[];
  increase: IInsightHighlightResponse[];
}

export interface IInsightHighlight {
  category: string;
  cnt: number;
  prevCnt: number;
  layerName: string;
  dataType: 'web' | 'poi';
  icon: string;
  percent: number;
  id: string;
  name: string;
  date: Date;
  viewable: boolean;
}

export interface IInsightHighlights {
  decrease: IInsightHighlight[];
  increase: IInsightHighlight[];
}
