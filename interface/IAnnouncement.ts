import type { IListResponse } from "~ui/interface/commons";

export enum AnnouncementType {
    Announcement = 1,
    Push,
}

export enum AnnouncementStatus {
    Publish = 'publish',
    Hide = 'hide',
    Test = 'test',
}

export interface IAnnouncementFilter {
    type: AnnouncementType;
    search?: string;
}

export interface IAnnouncementResponse {
    announcement_id?: string
    title?: string;
    content?: string;
    start_date?: number;
    end_date?: number;
    type?: AnnouncementType;
    status?: AnnouncementStatus;
    emails?: Array<string>;
    created_at?: number;
    updated_at?: number;
}

export type IAnnouncementListResponse = IListResponse<IAnnouncementResponse>;

export interface IAnnouncementInput {
    id?: string;
    title: string;
    content: string;
    startTime: string;
    endTime?: string;
    type: AnnouncementType;
    status: AnnouncementStatus;
    emails: Array<string>;
}

export default interface IAnnouncement {
    postId: string;
    postTitle: string;
    postContent: string;
    startTime: Date | null;
    endTime: Date | null;
    status: AnnouncementStatus;
    emails: Array<string>;
}