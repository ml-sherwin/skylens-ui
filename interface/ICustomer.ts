import type IIndustryType from '~ui/interface/IIndustryType';
import type { IIndustryTypeResponse } from '~ui/interface/IIndustryType';
import type IDateRange from '~ui/interface/IDateRange';
import type IProject from '~ui/interface/IProject';
import type { IProjectResponse } from '~ui/interface/IProject';
import type { IListResponse } from '~ui/interface/commons';

export interface ICustomerResponse {
    org_id?: string;
    name?: string;
    tax_id?: string;
    org_secret?: string;
    industry?: IIndustryTypeResponse;
    contact_name?: string;
    contact_gender?: string;
    contact_mobile?: string;
    contact_phone?: string;
    contact_email?: string;
    start_date?: string;
    end_date?: string;
    admins?: Array<string>;
    project?: IProjectResponse;
    project_count?: number;
    projects?: Array<IProjectResponse>;
    created_at?: number;
    updated_at?: number;
}

export type ICustomerListResponse = IListResponse<ICustomerResponse>;

export interface ICustomerInputParams {
    id?: string;
    taxId: string;
    name: string;
    industryTypeId: string;
    contactName: string;
    contactGender: string;
    contactEmail: string;
    contactPhone: string;
    contactMobile: string;
    period: IDateRange;
    admins: Array<string>;
    note?: string;
}

export default interface ICustomer {
    id: string;
    taxId?: string;
    name: string;
    industry?: IIndustryType;
    contactName?: string;
    contactGender?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactMobile?: string;
    note?: string;
    period?: IDateRange;
    admins?: Array<string>;
    project?: IProject | null;
    projects?: Array<IProject>;
    projectCount?: number;
    beShared?: boolean;
}