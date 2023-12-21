import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import {
  CellIndex,
  ConfigObject,
  DataFieldInput,
  DataValues,
  LocalDataProvider,
  RowValues,
  SelectionStyle,
} from "realgrid";
import { useDataProvider, useGridView } from "../hook/useRealGrid";
import { addRows } from "../util/realGridRowUtil";

export interface GridProps {
  columns: (ConfigObject | string)[];
  dataProvider: LocalDataProvider;
  onCurrentChanged?: (newCellIndex: CellIndex) => void;
  selectionmode?: SelectionStyle;
  addRows?: (rows: DataValues[]) => void;
  fetchNext?: () => void;
  style?: CSSProperties | undefined;
}
export default function InfiniteScrollGrid({
  columns,
  dataProvider,
  onCurrentChanged,
  selectionmode,
  fetchNext,
  style,
}: GridProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Realgrid - GridView
  const gridView = useGridView({
    gridContainer: gridContainerRef.current!,
    columns: columns,
    dataProvider: dataProvider,
    onCurrentChanged: onCurrentChanged,
    selectionmode: selectionmode,
  });

  // 그리드 무한 스크롤 페이징 - 이벤트 설정
  useEffect(() => {
    if (!gridView || !dataProvider) return;

    gridView.onScrollToBottom = () => {
      // TODO:: if (!hasNextPage) return;

      // fetch 전 행 편집 수정 내역을 저장.
      gridView.commit();

      fetchNext && fetchNext();      
    };
  }, [dataProvider, fetchNext, gridView]);

  return (
    <div>
      {/* {error && <Alert message={error} type={"error"} />} */}
      <div ref={gridContainerRef} style={{ ...style }} />
    </div>
  );
}
