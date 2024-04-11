import type { IPoiActivedCheck } from "~ui/interface/IPoi";

export interface IModuleResponse {
  name: string;
  code: string;
  enabled: boolean;
}

export interface IModuleCategoryResponse extends IModuleResponse {
  children: IModuleResponse[];
}

export interface IModule {
  code: string;
  name: string
  enabled: boolean;
}

export interface IModuleCategory extends IModule {
  children: IModule[];
}

export type ISettingItem = string | {
  name: string;
  domain?: string;
  pois?: Array<string>;
  poiIds?: Array<string>;
  filename?: string;
  pgId?: string | null;
  poiCount?: number;
  activedCheck?: IPoiActivedCheck | null;
};
