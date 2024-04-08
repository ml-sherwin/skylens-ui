export default interface ITableField {
    key: string;
    label: string;
    _style?: string | Object;
    _class?: string | Object | Array<string | Object>;
    sortable?: boolean;
    filterable?: boolean;
    colspan?: number;
    col?: {
        span?:number,
    };
    filterOptions?: {
        key: string;
        label?: string;
        icon?: string;
        _iconClass?: string;
    }[];
    tooltip?: string;
}