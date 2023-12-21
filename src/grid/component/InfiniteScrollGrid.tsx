import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import {
  CellIndex,
  ConfigObject,
  DataFieldInput,
  DataValues,
  RowValues,
  SelectionStyle,
} from "realgrid";
import { useDataProvider, useGridView } from "../hook/useRealGrid";
import { addRows } from "../util/realGridRowUtil";

export interface GridProps {
  rows: DataValues[];
  columns: (ConfigObject | string)[];
  fields: DataFieldInput[];
  onCellBeforeEdit?: (rowValues: RowValues) => boolean;
  onCellAfterEdit?: (rowValues: RowValues) => boolean;
  onCurrentChanged?: (newCellIndex: CellIndex) => void;
  selectionmode?: SelectionStyle;
  addRows?: (rows: DataValues[]) => void;
  fetchNext?: () => Promise<DataValues[]>
  style?: CSSProperties | undefined;
}
export default function InfiniteScrollGrid({
  rows,
  columns,
  fields,
  onCellBeforeEdit,
  onCellAfterEdit,
  onCurrentChanged,
  selectionmode,
  fetchNext,
  style,
}: GridProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Realgrid - LocalDataProvider
  const dataProvider = useDataProvider({
    undoable: true,
    dataFields: fields,
    initRows: rows,
    onCellBeforeEdit: onCellBeforeEdit,
    onCellAfterEdit: onCellAfterEdit,
  });

  // Realgrid - GridView
  const gridView = useGridView({
    gridContainer: gridContainerRef.current!,
    columns: columns,
    dataProvider: dataProvider,
    onCurrentChanged: onCurrentChanged,
    selectionmode: selectionmode,
  });

  const init = useCallback(() => {
    if (dataProvider) dataProvider.setRows(rows);
  }, [dataProvider, rows]);

  useEffect(() => {
    init();
  }, [init]);

  // 그리드 무한 스크롤 페이징 - 이벤트 설정
  useEffect(() => {
    if (!gridView || !dataProvider) return;

    gridView.onScrollToBottom = () => {
      // TODO:: if (!hasNextPage) return;

      // fetch 전 행 편집 수정 내역을 저장.
      gridView.commit();

      fetchNext && fetchNext().then(rows => {
        addRows({gridView, dataProvider, rows})
      })      
    };
  }, [dataProvider, fetchNext, gridView]);

  return (
    <div>
      {/* {error && <Alert message={error} type={"error"} />} */}
      <div ref={gridContainerRef} style={{ ...style }} />
    </div>
  );
}
