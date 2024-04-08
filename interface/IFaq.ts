import type { IListResponse } from "./commons";

export enum FAQCategoryKey {
    Online = 'online',
    Offline = 'offline',
    Compare = 'compare',
    Ad = 'ad',
}

export interface IFaqResponse {
    faq_id?: string;
    category?: string;
    title?: string;
    content?: string;
    created_at?: number;
    updated_at?: number;
}

export interface IFaqSummaryResponse {
    category: string;
    totalCount: number;
    data: Array<IFaqResponse>;
}

export type IFaqListResponse = IListResponse<IFaqResponse>

export interface IFaqFilter {
    search?: string;
    category?: string;
}



export interface IFAQCategory {
    key: string;
    name: string;
    faqs: Array<IFAQ>;
    color: string;
    total: number;
}

export default interface IFAQ {
    id: string;
    category: string;
    title: string;
    content: string;
}
