// import { useCallback, useEffect, useRef, useState } from "react";
// import { ConfigObject, DataFieldInput, DataValues, GridView, LocalDataProvider, RowValues } from "realgrid";
  
// export interface RealGridProps {
//     rows: DataValues[];
//     columns: (ConfigObject | string)[];
//     fields:  DataFieldInput[];
//     onCellBeforeEdit: (rowValues: RowValues) => boolean;
//     onCellAfterEdit: (rowValues: RowValues) => boolean;
//     onRowclick,
//     selectionmode,
//     style,  
// }
// export default function RealGrid({
//   rows,
//   columns,
//   fields,
//   onCellBeforeEdit,
//   onCellAfterEdit,
//   onRowclick,
//   selectionmode,
//   style,
// }:RealGridProps) {
//   const gridContainerRef = useRef<HTMLDivElement>();
//   const [gridView, setGridView] = useState<GridView>();
//   const [dataProvider, setDataProvider] = useState<LocalDataProvider>();

//   useEffect(() => {
//     init();
//   }, []);

//   useEffect(() => {
//     if (dataProvider) dataProvider.setRows(rows);
//   }, [dataProvider, rows]);

//   const init = useCallback(() => {
//     const el = gridContainerRef.current;
//     const localDataProvider = new LocalDataProvider();
//     localDataProvider.setFields(fields);
//     localDataProvider.onRowUpdating = (provider, rowNum) => {
//       if (onCellBeforeEdit) {
//         const values = provider.getRows()[rowNum];
//         return onCellBeforeEdit(values);
//       }
//       return true;
//     };
//     localDataProvider.onRowUpdated = (provider, rowNum) => {
//       if (onCellAfterEdit) {
//         const values = provider.getRows()[rowNum];
//         onCellAfterEdit(values);
//       }
//     };

//     setDataProvider(localDataProvider);

//     // TODO: error 
//     if(!el) return;

//     const gridView = new GridView(el);
//     gridView.setOptions({
//       indicator: { visible: false },
//       checkBar: { visible: false },
//       sateBar: { visible: false },
//       edit: {
//         insertable: true,
//         appendable: true,
//         updatable: true,
//         editable: true,
//       },
//     });
//     gridView.setSelectOptions({ style: selectionmode });
//     gridView.setDataSource(localDataProvider);

//     gridView.onCurrentChanged = (grid, newIndex) => {
//       const row = grid.getSelectionData()[0];
//       if (onRowclick) onRowclick(row);
//     };

//     gridView.setColumns(columns);

//     // const header = gridView.getColumnProperty('col1', 'header');
//     // header.text = '컬럼2';
//     // gridView.setColumnProperty('col1', 'header', header);

//     setGridView(gridView);
//   }, []);

//   return (
//     <div>
//       {error && <Alert message={error} type={"error"} />}
//       <div ref={gridContainerRef} className="real-grid" style={{ ...style }} />
//     </div>
//   );
// }

export default function RealGrid() {
    
};
