export enum OrgUserRole {
  Personal = 'personal',
  Admin = 'admin',
  Editor = 'editor',
  Normal = 'normal',
}

export interface IOrganizationResponse {
  org_id: string;
  tax_id: string;
  name: string;
  reseller_id: string;
  reseller_name: string;
  members: { email: string; role: OrgUserRole }[];
  allow_modules: string[];
  members_limit: number;
  members_count: number;
  projects_limit: number;
  projects_count: number;
  created_by: string;
  created_at: string;
}

export default interface IOrganization {
  id: string;
  taxId: string;
  name: string;
  reseller: {
    id: string;
    name: string;
  };
  members: { email: string; role: OrgUserRole }[];
  allow_modules: string[];
  membersLimit: number;
  membersCount: number;
  projectsLimit: number;
  projectsCount: number;
  createdBy: string;
  createdAt: Date | null;
}
