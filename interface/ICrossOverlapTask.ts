import type { IListResponse } from "~ui/interface/commons";
import type IDateRange from "~ui/interface/IDateRange";
import { OrgUserRole } from "~ui/interface/IOrganization";
import { PoiGroupType } from "~ui/interface/IPoi";

export enum CrossOverlapTaskStatus {
    Run = 'run',
    Complete = 'complete',
    Error = 'error',
}

export interface IPoiCrossOverlapTaskResponse {
    task_id: string;
    startdate: string;
    enddate: string;
    resource1: { name: string; type: PoiGroupType; pg_id: string; };
    resource2: { name: string; type: PoiGroupType; pg_id: string; };
    resources_cnt: Array<number>;
    overlap: number;
    status: CrossOverlapTaskStatus;
}

export type IPoiCrossOverlapTaskListResponse = IListResponse<IPoiCrossOverlapTaskResponse>;

export interface IPoiCrossOverlapTask {
    id: string;
    status: CrossOverlapTaskStatus;
    dateRange: IDateRange;
    sources: Array<{ id: string; name: string; type: PoiGroupType; pgId: string; }>;
    sourcesCnt: Array<number>;
    overlap: number;
}

export interface ICrossOverlapTaskResponse {
    task_id: string;
    startdate: string;
    enddate: string;
    resource1: { domain: string; name: string };
    resource2: { name: string; type: PoiGroupType; pg_id: string; };
    resources_cnt: number[];
    overlap: number;
    created_by: string;
    created_at: number;
    updated_at: number;
    status: CrossOverlapTaskStatus;
    members: { email: string; role: OrgUserRole }[];
}

export type ICrossOverlapTaskListResponse = IListResponse<ICrossOverlapTaskResponse>;

export interface ICrossOverlapTask {
    id: string;
    dateRange: IDateRange;
    domain: { domain: string; name: string };
    poiGroup: { name: string; type: PoiGroupType; id: string; pgId: string };
    resourcesCnt: number[];
    overlap: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    status: CrossOverlapTaskStatus;
    members: { email: string; role: OrgUserRole }[];
}
