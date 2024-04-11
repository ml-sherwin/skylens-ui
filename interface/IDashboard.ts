import { WidgetQueryMap } from '~ui/utils/constants';

type WidgetQueryMapKeyType = keyof typeof WidgetQueryMap;

export enum DashboardWidgetSourceType {
  Web = 'web',
  Poi = 'poi',
}

export enum DashboardWidgetSize {
  One = 1,
  Two,
}

export interface IDashboardWidget {
  id: string;
  code: string;
  sourceType: DashboardWidgetSourceType;
  title: string;
  desc: string;
  icon: string;
  img: string;
  disabledImg: string;
  allowSizes: DashboardWidgetSize[];
  size: DashboardWidgetSize;
  querys: WidgetQueryMapKeyType[];
}

export interface IDashboardBlockWidget {
  id: string;
  code: string;
  sourceType: DashboardWidgetSourceType;
  title: string;
  desc: string;
  icon: string;
  img?: string;
  querys: { all?: string[]; current?: string[]; compare?: string[] };
}

export interface IDashboardBlock {
  title: string;
  widgets: IDashboardBlockWidget[];
}