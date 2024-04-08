import type IDateRange from './IDateRange';

export enum ScreenSize {
    md = 'md',
    lg = 'lg',
    xl = 'xl',
    '1.5xl' = '1.5xl',
    '2xl' = '2xl',
}

export enum Gender {
    Male = 'male',
    Female = 'female',
}

enum ClipboardItemType {
    All = 'all',
    Location = 'locationCategory',
    Custom = 'customCategory',
    Domain = 'domain',
}

export interface IListResponse<T> {
    totalCount: number;
    data: Array<T>;
}

export enum AddDomainTab {
    Industry,
    Custom,
    Project,
};

export enum AddPoiTab {
    Custom,
    Industry,
    Project,
}

export interface IDateRanges {
    current: IDateRange | null;
    compare: IDateRange | null;
}
