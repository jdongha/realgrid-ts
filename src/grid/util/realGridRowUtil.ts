import { DataValues, GridView, LocalDataProvider } from "realgrid";

export interface RealGridCoreProps {
  gridView?: GridView;
  dataProvider?: LocalDataProvider;
}

export interface InsertRowProps extends RealGridCoreProps {
  row: DataValues;
}

export interface InsertRowsProps extends RealGridCoreProps {
  rows: DataValues[];
}

export interface AddRowProps extends InsertRowProps {}
export interface AddRowsProps extends InsertRowsProps {}

function isEmptyGridCore({ gridView, dataProvider }: RealGridCoreProps) {
  const isEmpty = !gridView || !dataProvider;

  isEmpty &&
    console.error(`Fail insertEmptyRow :: GridView/DataProvider is undefined`);

  return isEmpty;
}

function insertEmptyRow({ gridView, dataProvider }: RealGridCoreProps) {
  if (isEmptyGridCore({ gridView, dataProvider })) return;

  const row = gridView!.getCurrent().dataRow || 0;
  dataProvider!.insertRow(row, {});
  //gridView.showEditor(); //바로 편집기를 표시하고 싶을때
}

function insertRow({ gridView, dataProvider, row: rowValue }: InsertRowProps) {
  const isEmptyRow = !rowValue;
  if (isEmptyGridCore({ gridView, dataProvider }) && isEmptyRow) {
    isEmptyRow && console.error(`Fail insertRow :: Row is undefined`);
    return;
  }

  const row = gridView!.getCurrent().dataRow || 0;
  dataProvider!.insertRow(row, rowValue);
  //gridView.showEditor(); //바로 편집기를 표시하고 싶을때
}

function addEmptyRow({ gridView, dataProvider }: RealGridCoreProps) {
  if (isEmptyGridCore({ gridView, dataProvider })) return;

  const dataRow = dataProvider!.addRow({});
  gridView!.setCurrent({ dataRow: dataRow }); //추가된 행으로 포커스 이동
  //setTimeout(function(){gridView.showEditor();}, 10); //바로 편집기를 표시하고 싶을때
}

function addRow({ gridView, dataProvider, row: rowValue }: AddRowProps) {
  const isEmptyRow = !rowValue;
  if (isEmptyGridCore({ gridView, dataProvider }) && isEmptyRow) {
    isEmptyRow && console.error(`Fail addRow :: Row is undefined`);
    return;
  }

  const dataRow = dataProvider!.addRow(rowValue);
  gridView!.setCurrent({ dataRow: dataRow }); //추가된 행으로 포커스 이동
  //setTimeout(function(){gridView.showEditor();}, 10); //바로 편집기를 표시하고 싶을때
}

function addRows({
  gridView,
  dataProvider,
  rows: rowsValue,
}: AddRowsProps) {
  const isEmptyRow = !rowsValue || rowsValue.length === 0;
  if (isEmptyGridCore({ gridView, dataProvider }) && isEmptyRow) {
    isEmptyRow && console.error(`Fail addRow :: Row is undefined`);
    return;
  }

  dataProvider!.addRows(rowsValue);
  // gridView!.setCurrent({ dataRow: dataRow }); //추가된 행으로 포커스 이동
  //setTimeout(function(){gridView.showEditor();}, 10); //바로 편집기를 표시하고 싶을때
}

export { addRow, addEmptyRow, insertEmptyRow, insertRow, addRows };
