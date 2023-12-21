import { UserRow, columns, fields } from "../grid/defination/userList.ds";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDataProvider, useGridView } from "../grid/hook/useRealGrid";
import { Result, UserListResponse } from "../api/user/userListTypes";
import { fetchGetUserList } from "../api/user/useGetUserList";
import { addRows } from "../grid/util/realGridRowUtil";

const init_params = { page: 1, results: 20 };

export default function User() {
  const realgridElement = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useState(init_params);

  // Fn. Convert org to grid row values
  const mappedRow = useCallback((org: Result[]) => {
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

  // Realgrid - LocalDataProvider
  const provider = useDataProvider({
    undoable: true,
    dataFields: fields,
  });

  // Realgrid - GridView
  const grid = useGridView({
    gridContainer: realgridElement.current!,
    columns: columns,
    dataProvider: provider,
  });

  // 그리드 무한 스크롤 페이징 - 이벤트 설정
  useEffect(() => {
    if (!grid) return;

    grid.onScrollToBottom = () => {
      // TODO:: if (!hasNextPage) return;

      // fetch 전 행 편집 수정 내역을 저장.
      grid.commit();

      setSearchParams((curr) => {
        return {
          ...curr,
          page: searchParams.page + 1,
        };
      });
    };
  }, [grid, searchParams.page]);

  // Rquest init page, next page
  useEffect(() => {
    if (!grid || !provider) return;

    fetchGetUserList(searchParams).then((data: UserListResponse) => {
      const isEmpty = provider.getRowCount() === 0;
      const rows = mappedRow(data?.results || []);
      isEmpty
        // init set
        ? provider.setRows(rows)
        // add rows
        : addRows({
            gridView: grid,
            dataProvider: provider,
            rows: rows,
          });
    });
  }, [grid, provider, searchParams]);

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
