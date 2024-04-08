export interface IDataSourceItem {
    checked: boolean;
    disabled: boolean;
    visible?: boolean;
}

export default interface IDataSource {
    mobile: IDataSourceItem;
    cable: IDataSourceItem;
}