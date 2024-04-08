import type IDateRange from "./IDateRange";
import type { IDomainInput } from "./IDomain";
import type IHourRange from "./IHourRange";
import type { IInputPoiGroup } from "./IPoi";
import type IStayRange from "./IStayRange";
import type { OnlineSourceType } from "./IWeb";

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