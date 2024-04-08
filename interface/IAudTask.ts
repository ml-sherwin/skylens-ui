import type { IListResponse } from "@/interface/commons";
import type IDateRange from "~/interface/IDateRange";
import type IStayRange from '~/interface/IStayRange';
import type IHourRange from '~/interface/IHourRange';

export enum AudTaskStatus {
    Run = 'run',
    Error = 'error',
    Warn = 'warn',
    Complete = 'complete',
}

export enum AudTaskCMType {
    GID = 'cmGID',
    IFA = 'cmIFA',
}

export enum LatlonSource {
    Old = 'old',
    New = 'new',
}

export enum AudSetType {
    Include = 'include',
    Difference = 'difference',
}

export enum AudUnionSubsetType {
    Domain = 'domain',
    Latlon = 'latlon',
}

export interface IAudTaskFilterInput {
    month?: number;
    recent?: boolean;
    search?: string;
    status?: AudTaskStatus;
    year?: number;
}

export interface IUnionSubsetInput {
    name: string;
    startdate: string;
    enddate: string;
}

export interface ILatlonUnionSubsetFilter {
    frequency?: number;
    startHr?: number;
    endHr?: number;
    minStayMins?: number;
    maxStayMins?: number;
}

export interface IDomainItem {
    status: string;
    domain: string;
}

export interface ILatlonItem {
    status: string;
    latlon: string;
}

export interface IUnionSubsetSource {
    domains?: Array<string>;
    latlons?: Array<string>;
    pg_id?: string;
    poi_count?: number;
    startdate: string;
    enddate: string;
    filter?: ILatlonUnionSubsetFilter;
    name: string;
}

export interface IAudCMReport {
    key?: AudTaskCMType;
    name: AudTaskCMType | string;
    status: AudTaskStatus;
    sourceCount: number;
    targetCount: number;
}

export interface IFormatedAudCMReport {
    key?: AudTaskCMType;
    name: AudTaskCMType | string;
    status: AudTaskStatus;
    sourceCount: string;
    targetCount: string;
    ratio: string;
}

export interface IAudTopSitesReportDetail {
    domain: string;
    cnt: number;
}

export interface IAudTopSitesReport {
    status: AudTaskStatus;
    message?: string;
    data: Array<IAudTopSitesReportDetail>;
}

export interface IAudProfileItem {
    name: string;
    cnt: number;
}

export interface IAudProfile {
    status: AudTaskStatus;
    message?: string;
    gender: Array<IAudProfileItem>;
    age: Array<IAudProfileItem>;
    homeCity: Array<IAudProfileItem>;
    workCity: Array<IAudProfileItem>;
}

export interface IAudInterestReportDetail {
    name: string;
    cnt: number;
}

export interface IAudInterestReport {
    status: AudTaskStatus;
    message?: string;
    data: Array<IAudInterestReportDetail>;
}

export interface IAudReport {
    cm: Array<IAudCMReport>;
    topSites: IAudTopSitesReport;
    profile: IAudProfile;
    interest: IAudInterestReport;
}

export interface IAudTaskResponse {
    task_id?: string;
    project_id?: string;
    name?: string;
    status?: AudTaskStatus;
    and?: string;
    not?: string;
    uuid?: string;
    steps?: Array<number>;
    ages?: Array<string>;
    genders?: Array<string>;
    workCity?: Array<string>;
    homeCity?: Array<string>;
    profile?: boolean;
    interest?: boolean;
    topSites?: boolean;
    cm?: Array<AudTaskCMType>;
    reports?: IAudReport;
    created_at?: number;
    updated_at?: number;
}

export type IAudTaskListResponse = IListResponse<IAudTaskResponse>;

export interface IAudTaskInput {
    name: string;
    and: string;
    not?: string;
    genders: Array<string>;
    ages: Array<string>;
    workCity: Array<string>;
    homeCity: Array<string>;
    cm: Array<string>;
    interest: boolean;
    profile: boolean;
    topSites: boolean;
    topSites_startdate?: string;
    topSites_enddate?: string;
}

export interface IAudTaskUnionSubset {
    id?: string;
    name: string;
    dateRange: IDateRange | null;
    serialized?: IUnionSubsetInput;
    normalize?(source: IUnionSubsetSource): IAudTaskUnionSubset;
}

export interface IDomainUnionSubsetInput extends IUnionSubsetInput {
    domains: Array<string>;
}

export interface ILatlonUnionSubsetInput extends IUnionSubsetInput {
    filter?: ILatlonUnionSubsetFilter;
    latlons?: Array<string>;
    pg_id?: string;
}

export interface IDomainUnionSubset extends IAudTaskUnionSubset {
    items?: Array<IDomainItem>;
    readonly type: AudUnionSubsetType.Domain;
    readonly isAccept: boolean;
    readonly itemLength: number;
    readonly serialized: IDomainUnionSubsetInput;
}

export interface ILatlonUnionSubset extends IAudTaskUnionSubset {
    frequency: number;
    hourRange?: IHourRange | null;
    stayRange?: IStayRange | null;
    latlonSource: LatlonSource;
    items?: Array<ILatlonItem>;
    pgId?: string;
    poiCount?: number;
    readonly type: AudUnionSubsetType.Latlon;
    readonly isAccept: boolean;
    readonly itemLength: number;
    readonly serialized: ILatlonUnionSubsetInput;
}

export interface IAudTaskSet {
    id?: string;
    sets: Array<IDomainUnionSubset | ILatlonUnionSubset>;
}

export interface IAudCreateTask {
    name: string;
    note: string;
    cm: Array<AudTaskCMType>,
    gender: number,
    ages: Array<string>,
    workAt: Array<string>,
    homeAt: Array<string>,
    includeSets: Array<IAudTaskSet>;
    differenceSets: Array<IAudTaskSet>;
}

export default interface IAudTask {
    id: string;
    name: string;
    status: AudTaskStatus;
    includeSets: Array<IAudTaskSet>;
    differenceSets: Array<IAudTaskSet>;
    uuid: string;
    steps: Array<number>;
    ages: Array<{ key: string, name: string }>;
    gender: { key: string, name: string };
    workAt: Array<string>;
    homeAt: Array<string>;
    cms: Array<IFormatedAudCMReport>;
    profile: IAudProfile | null;
    interest: IAudInterestReport | null;
    createdAt: string;
    updatedAt: string;
}
