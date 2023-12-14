import { useCallback, useEffect, useRef } from "react";
import {
  ConfigObject,
  DataFieldInput,
  DataValues,
  GridView,
  LocalDataProvider,
} from "realgrid";

export interface RealGridConstructorProps {
  gridContainer: HTMLDivElement | null | undefined;
  columns: ConfigObject;
  dataFields: DataFieldInput[];
}

/**
 *
 */
export const useRealGrid = <TDataRow extends DataValues>({
  gridContainer,
  columns,
  dataFields,
}: RealGridConstructorProps) => {
  const gridRef = useRef<GridView | undefined>();
  const dataProvider = useRef<LocalDataProvider | undefined>();

  // Create & initialize
  if (!gridContainer) return {};

  const gv = new GridView(gridContainer);
  const dp = new LocalDataProvider(true);

  gridRef.current = gv;
  dataProvider.current = dp;
  console.debug(`Grid:::: `, gridRef.current);
  console.debug(`Provider::: `, dataProvider.current);

  gridRef.current.setColumn(columns);
  gridRef.current.setDataSource(dp);
  dataProvider.current.setFields(dataFields);

  console.debug(`Complete create GridVidw`);

  const setRows = (rows: TDataRow[]) => {
    if (!dataProvider.current) return;

    dataProvider.current.setRows(rows);

    console.debug(`Complete setRows`);
  };

  return {
    gridView: gridRef.current,
    localDataProvider: dataProvider.current,
    setRows: setRows,
  };
};
