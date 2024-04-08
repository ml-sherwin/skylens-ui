import type { IListResponse } from "@/interface/commons";
import type { IModuleCategory, IModuleCategoryResponse } from "./IModule";
import type IProject from "./IProject";
import type { IProjectResponse } from "./IProject";
import { OrgUserRole } from "./IOrganization";

export enum UserRole {
  SuperUser = "su",
  SystemAdmin = 'sys_admin',
  Normal = 'normal',
}

export enum UserLanguage {
  Zh = 'zh',
  En = 'en',
  Ja = 'ja',
}

export enum UserStatus {
  Inactive = 'inactive',
  Normal = 'normal',
  Stop = 'stop',
}

export enum ShareEmailStatus {
  Normal = 1,
  No_Company,
  Warn_Email,
  Not_Exist,
  Blocked,
}

interface IUserOrgResponse {
  org_id: string;
  name: string;
  role: OrgUserRole;
  startdate: string;
  enddate: string;
}

export interface IUserResponse {
  user_id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  mobile: string;
  modules: IModuleCategoryResponse[];
  login_at: number;
  lang: UserLanguage;
  status: UserStatus;
  orgs: IUserOrgResponse[];
  projects: IProjectResponse[];
  created_by: string;
  created_at: number;
}

export interface IOrgUserResponse {
  user_id: string;
  email: string;
  name: string;
  role: OrgUserRole;
  phone: string;
  mobile: string;
  login_at: number | null;
  lang: UserLanguage;
  status: UserStatus;
  created_by: string;
  created_at: number;
}

interface IUserOrg {
  id: string;
  name: string;
  role: OrgUserRole;
  startDate?: Date | null;
  endDate?: Date | null,
}

export interface IUserInput {
  name: string;
  email: string;
  password?: string;
  phone: string;
}

export default interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  mobile: string;
  modules: IModuleCategory[];
  loginAt: Date | null;
  status: UserStatus;
  org: IUserOrg | null;
  projects: IProject[];
}

export interface IUserFilter {
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface IUserProject {
  id: string;
  name: string;
  role: OrgUserRole;
  org: {
      id: string;
      name: string;
  }
  domainResources: { domain: string; name: string }[];
  poiResources: { isDefaultCategory: boolean, id: string; name: string; poiCount: number; poiActived: number; dataDate: Date | null; }[];
}

export type IUserListResponse = IListResponse<IUserResponse>;
