export interface IIndustryTagResponse {
    industry_tag_id?: string;
    name?: string;
    name_zh?: string;
    name_en?: string;
    name_ja?: string;
}

export default interface IIndustryTag {
    id: string;
    name: {
        default: string,
        zh?: string,
        en?: string,
        ja?: string,
    };
}
