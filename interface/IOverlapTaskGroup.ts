import type IDateRange from "~ui/interface/IDateRange";
import type { IDomainInput } from "~ui/interface/IDomain";
import type IHourRange from "~ui/interface/IHourRange";
import type { IInputPoiGroup } from "~ui/interface/IPoi";
import type IStayRange from "~ui/interface/IStayRange";
import type { OnlineSourceType } from "~ui/interface/IWeb";

export enum OverlapTaskGroupType {
  Web = 'web',
  Poi = 'poi',
  AUD = 'audience',
}

export default interface IOverlapTaskGroup {
  groupKey: number;
  type: OverlapTaskGroupType;
  icon: string;
  name: string;
  sourceType?: OnlineSourceType;
  dateRange?: IDateRange | null;
  domains?: IDomainInput[];
  poiGroups?: IInputPoiGroup[];
  aud?: {
    id?: string;
    uuid: string;
    createdAt: Date | null;
    domainSets?: {
      name: string;
      count: number;
    }[];
    poiGroupSets?: {
      name: string;
      count: number;
    }[];
  };
  frequency?: number;
  hourRange?: IHourRange | null;
  stayRange?: IStayRange | null;
  uu: number;
}