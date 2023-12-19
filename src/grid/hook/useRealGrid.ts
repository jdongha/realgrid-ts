import { useEffect, useState } from "react";
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
  initRows: DataValues[];
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
  const [gv, setGv] = useState<GridView>();

  // Create GridView
  useEffect(() => {
    if (!gridContainer) return;

    setGv(new GridView(gridContainer));
    console.debug("Create GridView");

    return () => {
      gv?.destroy();
      console.debug("Destroy GridView.");
    };
  }, [gridContainer]);

  // Init set columns
  useEffect(() => {
    if (!gv) return;

    gv.setColumns(columns);
    console.debug("Set colums");
  }, [columns, gv]);

  // Init set dataProvider
  useEffect(() => {
    if (!gv || !dp) return;

    gv.setDataSource(dp);
    console.debug("Set dataProvider");
  }, [columns, dp, gv]);

  return gv;
};

const useDataProvider = ({
  dataFields,
  initRows,
  undoable = false,
}: RealGridDataProviderConstructorProps) => {
  const [dp, setDp] = useState<LocalDataProvider>();

  useEffect(() => {
    setDp(new LocalDataProvider(undoable))
    console.debug("Create LocalDataProvider");

    return () => {
      dp?.clearRows();
      dp?.destroy();
      console.debug("destroy LocalDataProvider");
    };
  }, [undoable]);

  useEffect(() => {
    if (!dp) return;

    dp.setFields(dataFields);
    console.debug("Set fields");
  }, [dataFields, dp]);

  useEffect(() => {
    if (!dp) return;

    dp.setRows(initRows);
    const hasData = initRows && initRows.length > 0;
    console.debug(
      hasData ? `Set rows::: ${initRows}` : `Set rows: Empty Data Array`
    );
  }, [dp, initRows]);

  return dp;
};

export { useGridView, useDataProvider };
