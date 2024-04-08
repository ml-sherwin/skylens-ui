export enum StayRangeLevel {
    Minutes = 'minutes',
    Hours = 'hours',
}

export default interface IStayRange {
    start: {
        value: number | null,
        level: StayRangeLevel,
    } | null;
    end: {
        value: number | null,
        level: StayRangeLevel,
    } | null;
}
