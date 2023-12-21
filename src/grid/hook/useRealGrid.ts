import { useEffect, useState } from "react";
import {
  CellIndex,
  ConfigObject,
  DataFieldInput,
  DataValues,
  GridView,
  LocalDataProvider,
  RowValues,
  SelectionStyle,
  ViewOptions,
} from "realgrid";

export interface RealGridViewConstructorProps {
  gridContainer: HTMLDivElement | null | undefined;
  columns: (string | ConfigObject)[];
  options?: ViewOptions;
  onCurrentChanged?: (newCellIndex: CellIndex) => void;
  selectionmode?: SelectionStyle;
  dataProvider?: LocalDataProvider;
}

export interface RealGridDataProviderConstructorProps {
  dataFields: DataFieldInput[];
  initRows?: DataValues[];
  undoable?: boolean;
  onCellBeforeEdit?: (rowValues: RowValues) => boolean;
  onCellAfterEdit?: (rowValues: RowValues) => boolean;
}

const INIT_GRID_OPT: ViewOptions = {
  checkBar: { visible: false },
  edit: {
    insertable: true,
    appendable: true,
    updatable: true,
    editable: true,
  },
  rowIndicator: {
    zeroBase: true,
    visible: true,
  },
  stateBar: { visible: true },
};

/**
 *
 */
const useGridView = ({
  gridContainer,
  columns,
  options,
  onCurrentChanged,
  selectionmode,
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

  // Init set options
  useEffect(() => {
    if (!gv) return;
    gv.setOptions({ ...INIT_GRID_OPT, ...options });
    console.debug("Set Options");
  }, [options, gv]);

  // Init set onCurrentChanged
  useEffect(() => {
    if (!gv) return;

    gv.onCurrentChanged = (grid, newCellIndex) => {
      if (onCurrentChanged) {
        console.debug("Set onCurrentChanged");
        onCurrentChanged(newCellIndex);
      }
    };
  }, [onCurrentChanged, gv]);

  // Init set selectionmode
  useEffect(() => {
    if (!gv) return;

    console.debug("Set selectionmode");
    gv.setSelection({style: selectionmode})
  }, [selectionmode, gv]);


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
  onCellBeforeEdit,
  onCellAfterEdit
}: RealGridDataProviderConstructorProps) => {
  const [dp, setDp] = useState<LocalDataProvider>();

  useEffect(() => {
    setDp(new LocalDataProvider(undoable));
    console.debug("Create LocalDataProvider");

    return () => {
      dp?.clearRows();
      dp?.destroy();
    };
  }, [undoable]);

  useEffect(() => {
    if (!dp) return;

    dp.setFields(dataFields);
    console.debug("Set fields");
  }, [dataFields, dp]);

  useEffect(() => {
    if (!dp || !initRows) return;

    dp.setRows(initRows);
    const hasData = initRows && initRows.length > 0;
    console.debug(
      hasData ? `Set rows::: ${initRows}` : `Set rows: Empty Data Array`
    );
  }, [dp, initRows]);

  useEffect(() => {
    if (!dp) return;

    dp.onRowUpdating = (provider, rowNum) => {
      if (onCellBeforeEdit) {
        console.debug("set onRowUpdating");

        const values = provider.getRows()[rowNum];
        return onCellBeforeEdit(values);
      }
      return true;
    };
  }, [dp, onCellBeforeEdit]);

  useEffect(() => {
    if (!dp) return;

    dp.onRowUpdated = (provider, rowNum) => {
      if (onCellAfterEdit) {
        console.debug("set onRowUpdated");

        const values = provider.getRows()[rowNum];
        onCellAfterEdit(values);
      }
    };
  }, [dp, onCellAfterEdit]);

  return dp;
};

export { useGridView, useDataProvider };
