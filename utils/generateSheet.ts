export default ({
  name,
  project = '',
  dateRangeString = '',
  compareDateRangeString = '',
  sources = [],
  additionalRows = [],
  headerCols = [],
  rows = [],
}: {
  name: string,
  project?: string,
  dateRangeString?: string,
  compareDateRangeString?: string,
  sources?: Array<string>,
  additionalRows?: Array<Array<string | number>>,
  headerCols?: Array<string>,
  rows?: Array<Array<string | number>>,
}) => {
  const data = [];
  if (project) data.push(['專案名稱', project]);
  if (dateRangeString) data.push(['數據區間', dateRangeString]);
  if (compareDateRangeString) data.push(['前期數據區間', compareDateRangeString]);
  if (sources?.length > 0) data.push(['數據來源', sources.join(',')]);
  if (additionalRows?.length > 0) data.push(...additionalRows);

  if (data.length > 0) data.push(['']);

  if (headerCols?.length > 0) data.push(headerCols);
  data.push(...rows);

  return {
    sheetName: name,
    sheetData: data,
  };
};
