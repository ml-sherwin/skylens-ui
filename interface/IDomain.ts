import type { IListResponse } from "./commons";

export enum DomainStatusResponse {
  Normal = 'normal',
  Wait = 'wait',
  Reject = 'reject',
}

export enum DomainStatus {
  None = 'none',
  Loading = 'loading',
  Tracking = 'tracking',
  Untrack = 'untrack',
  Block = 'block',
  All = 'all',
  Unaccessable = 'unaccessable',
}

export enum DomainNameInvalidFeedback {
  None = '',
  Duplicated = 'duplicated',
  Empty = 'empty',
}

export interface IDomainAttrResponse {
  attr_id: string;
  name: string;
  name_zh: string;
  name_en: string;
  name_ja: string;
}

export interface IDomainAttr {
  id: string;
  name: {
    default: string;
    zh: string;
    en: string;
    ja: string;
  }
}

export interface IDomainListFilter {
  search?: string;
  hostid?: string;
  domain?: string;
  name?: string;
  domain_group?: string;
  itype1?: string[];
  itype2?: string[];
  attrs?: string[];
  is_active?: boolean;
  status?: DomainStatus;
}

export interface IDomainResponse {
  hostid: string;
  ad_code: string;
  domain: string;
  name: string;
  domain_group: string;
  itype1: string;
  itype2: string;
  attrs: string[];
  created_by: string;
  created_at: number;
  updated_by: string;
  updated_at: number;
  tracked_at: string;
  status: DomainStatusResponse;
  is_active: boolean;
  memo: string;
}

export type IDomainListResponse = IListResponse<IDomainResponse>;

export interface IDomainInput {
  domain: string;
  name: {
    value: string,
    invalidFeedback: DomainNameInvalidFeedback,
  };
  status: DomainStatus;
  isActive: boolean;
  trackedAt?: Date | null;
  visitors?: number | null;
  isNew?: boolean;
}

export interface IFormatedDomainInput {
  domain: string;
  name: {
    value: string,
    invalidFeedback: DomainNameInvalidFeedback,
  };
  status: DomainStatus,
  isActive: boolean;
  trackedAt?: string;
  visitors?: number | null;
  isNew?: boolean;
}

export default interface IDomain {
  domain: string;
  name: string;
  attrs?: string[];
  trackedAt?: Date | null;
  status: DomainStatus;
  isActive: boolean;
}

export interface IDomainGroupResponse {
  name?: string;
  count?: Number;
  domains?: Array<string>;
}

export interface IDomainFilterResponse {
  filter_id: string;
  name: string;
  domains: Array<string>;
  created_at?: number;
  updated_at?: number;
}

export interface IDomainFilter {
  filterId: string;
  name: string;
  domains: Array<string>;
}
