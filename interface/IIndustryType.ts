interface IIndustryTypeBasicResponse {
    itype_id: string;
    name: string;
    name_zh: string;
    name_en: string;
    name_ja: string;
    domain_count?: number;
}

export interface IIndustryTypeResponse extends IIndustryTypeBasicResponse {
    children: IIndustryTypeBasicResponse[];
}

export interface IIndustryTypeBasic {
    id: string;
    name: {
        default: string;
        zh: string;
        en: string;
        ja: string;
    };
    domainCount?: number;
}

export default interface IIndustryType extends IIndustryTypeBasic {
    subTypes: IIndustryTypeBasic[],
}

export interface IFormatedIndustryTypeTag {
    name: string;
    visitors: number;
    pageviews: number;
    avgPageviews?: number;
    domains: Array<{
        name: string,
        domain: string,
        visitors: number,
        pageviews: number,
        avgPageviews?: number,
        rank?: number;
    }>;
    rank?: number;
}

export interface IFormatedIndustryType extends IIndustryType {
    visitors: number;
    tags: Array<IFormatedIndustryTypeTag>;
    rank?: number;
}

export interface IIndustryTypeItemTag {
    name: string;
    rank: Array<number>;
    visitors: Array<number>;
    pageviews: Array<number>;
    avgPageviews: Array<number>;
    visitorsPercentage?: Array<number>;
    avgPageviewsPercentage?: Array<number>;
    domains: Array<{
        name: string,
        domain: string,
        rank: Array<number>,
        visitors: Array<number>,
        pageviews: Array<number>,
        avgPageviews: Array<number>,
    }>;
}

export interface IIndustryTypeItem {
    id: string;
    name: {
        default?: string,
        zh?: string,
        en?: string,
        ja?: string,
    };
    rank: Array<number>,
    visitors: Array<number>,
    tags: Array<IIndustryTypeItemTag>,
}