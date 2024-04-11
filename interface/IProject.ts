import type IDomain from "~ui/interface/IDomain";
import type { IDomainResponse } from "~ui/interface/IDomain";
import type { IModuleCategory, IModuleCategoryResponse } from "~ui/interface/IModule";
import type { IPoiGroup, IPoiGroupResponse } from "~ui/interface/IPoi";
import type { OrgUserRole } from "~ui/interface/IOrganization";
import type { IListResponse } from '~ui/interface/commons';

export interface IProjectStorageResponse {
  project_id: string;
  data: string;
  domain_availabled: boolean;
  poi_availabled: boolean;
}

interface IProjectMemberResponse {
  email: string;
  role: OrgUserRole;
}

export interface IProjectMember {
  email: string;
  role: OrgUserRole;
}

export interface IProjectResponse {
  project_id: string;
  name: string;
  csv: boolean;
  role: OrgUserRole;
  org_id: string;
  org_name: string;
  members: IProjectMemberResponse[];
  modules: IModuleCategoryResponse[];
  created_by: string;
  created_at: number;
  updated_by: string | null;
  updated_at: number;
  domain_resources: IDomainResponse[];
  poi_resources: IPoiGroupResponse[];
}

export type IProjectListResponse = IListResponse<IProjectResponse>;

export default interface IProject {
  id: string;
  name: string;
  csv: boolean;
  role?: OrgUserRole;
  org: {
    id: string;
    name: string;
  };
  members: IProjectMember[];
  modules?: IModuleCategory[];
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
  domains: IDomain[];
  poiGroups: IPoiGroup[];
  dashboardWidgets: {
    widgets2023: string[],
  } | null;
  domainAvailabled: boolean;
  poiAvailabled: boolean;
}
