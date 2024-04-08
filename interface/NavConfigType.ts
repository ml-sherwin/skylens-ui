export type NavItemConfigType = {
  moduleType: 'project' | 'org' | 'system' | 'dashboard',
  title: string;
  to?: string;
  code?: string;
  emit?: string;
  preIcon?: string;
  postIcon?: string;
  subItems?: NavItemConfigType[];
  include?: string[];
  inDev?: boolean;
}

export type NavConfigType = (NavItemConfigType | null)[];
