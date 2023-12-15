import { columns, fields } from "../grid/defination/userList.ds";
import { useCallback, useEffect, useRef } from "react";
import { useInfiniteGetUserList } from "../api/user/useInfiniteGetUserList";
import { useDataProvider, useGridView } from "../grid/hook/useRealGrid";
import { addRow } from "../grid/util/realGridRowUtil";
import { Result } from "../api/user/userListTypes";

export default function User() {
  const realgridElement = useRef<HTMLDivElement>(null);
  const { data, hasNextPage, fetchNextPage } = useInfiniteGetUserList({
    results: 20,
  });

  // Convert org to grid row values
  const mappedRow = useCallback((org: Result[] | undefined) => {
    return (
      org?.map((result) => {
        if (!result) return {};

        return {
          name: `${result.name.first} ${result.name.last}`,
          email: result.email,
          age: result.dob.age,
          location: `${result.location.city} ${result.location.state} ${result.location.country}`,
        };
      }) || []
    );
  }, []);
  const isEmptyData = !data?.pages || data?.pages.length === 0;
  const initPageOriginResult = isEmptyData ? [] : data.pages[0]?.result;
  const initPageRows = mappedRow(initPageOriginResult);

  // Realgrid - LocalDataProvider
  const dp = useDataProvider({
    undoable: true,
    dataFields: fields,
    rows: initPageRows,
  });

  // Realgrid - GridView
  const gv = useGridView({
    gridContainer: realgridElement.current!,
    columns: columns,
    dataProvider: dp.current,
  });

  // 그리드 무한 스크롤 페이징 - 이벤트 설정
  useEffect(() => {
    const grid = gv.current;
    if (!grid) return;

    grid.onScrollToBottom = () => {
      if (!hasNextPage) return;
      // fetch 전 행 편집 수정 내역을 저장.
      grid.commit();
      // Request next page
      fetchNextPage();
    };
  }, [fetchNextPage, gv, hasNextPage]);

  // 그리드 무한 스크롤 페이징 - Append rows
  useEffect(() => {
    const dataProvider = dp.current;
    const isAppendPage = !!data && !!data.pages && data.pages.length > 1;

    if (!dataProvider || !isAppendPage) return;

    const pageIdx = data!.pages.length - 1;
    const appendOrg = data!.pages[pageIdx]?.result;

    addRow({
      gridView: gv.current,
      dataProvider: dataProvider,
      row: mappedRow(appendOrg),
    });
  }, [data?.pages]);

  return (
    <>
      <h2>RealGrid2 - User List</h2>
      <div
        style={{ height: "500px", width: "100%" }}
        ref={realgridElement}
      ></div>
    </>
  );
}
