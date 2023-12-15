import { useEffect, useRef } from "react";
import {
  ConfigObject,
  DataFieldInput,
  DataValues,
  GridView,
  LocalDataProvider,
} from "realgrid";

export interface RealGridViewConstructorProps {
  gridContainer: HTMLDivElement | null | undefined;
  columns: (string | ConfigObject)[];
  dataProvider?: LocalDataProvider;
}

export interface RealGridDataProviderConstructorProps {
  dataFields: DataFieldInput[];
  rows: DataValues[];
  undoable?: boolean;
}

/**
 *
 */
const useGridView = ({
  gridContainer,
  columns,
  dataProvider: dp,
}: RealGridViewConstructorProps) => {
  const gv = useRef<GridView>();

  useEffect(() => {
    if (!gridContainer) return;

    gv.current = new GridView(gridContainer!);
    const gvVal = gv.current;
    console.debug("Create GridView");

    return () => {
      gvVal.destroy();
      console.debug("Destroy GridView.");
    };
  }, [columns, dp, gridContainer]);

  useEffect(() => {
    const gvVal = gv.current;

    if (!gvVal || !dp) return;

    gvVal.setDataSource(dp);
    gvVal.setColumns(columns);
    console.debug("Set colums/dataProvider");
  }, [columns, dp]);

  return gv;
};

const useDataProvider = ({
  dataFields,
  rows,
  undoable = false
}: RealGridDataProviderConstructorProps) => {
  const dp = useRef<LocalDataProvider>();

  useEffect(() => {
    dp.current = new LocalDataProvider(undoable);
    const dpVal = dp.current;
    console.debug("Create LocalDataProvider");

    return () => {
      dpVal.clearRows();
      dpVal.destroy();
      console.debug("destroy LocalDataProvider");
    };
  }, [undoable]);

  useEffect(() => {
    const dpVal = dp.current;
    if (!dpVal) return;

    dpVal.setFields(dataFields);
    console.debug("Set fields");

    const hasData = rows && rows.length > 0;
    dpVal.setRows(rows);
    console.debug(
      hasData ? `Set rows::: ${rows}` : `Set rows: Empty Data Array`
    );
  }, [dataFields, rows]);

  return dp;
};

export { useGridView, useDataProvider };
