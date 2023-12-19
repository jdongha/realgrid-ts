import { UserRow, columns, fields } from "../grid/defination/userList.ds";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDataProvider, useGridView } from "../grid/hook/useRealGrid";
import { Result, UserListResponse } from "../api/user/userListTypes";
import { fetchGetUserList } from "../api/user/useGetUserList";
import { addManyRows } from "../grid/util/realGridRowUtil";

const init_params = { page: 1, results: 20 };

export default function User() {
  const realgridElement = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useState(init_params);
  const [initPageRows, setInitPageRows] = useState<UserRow[]>([]);

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

  // Request grid initial data
  useEffect(() => {
    fetchGetUserList(init_params).then((data: UserListResponse) => {
      const rows = mappedRow(data?.results || []);
      setInitPageRows(rows);
    });
  }, []);

  // Realgrid - LocalDataProvider
  const provider = useDataProvider({
    undoable: true,
    dataFields: fields,
    initRows: initPageRows,
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

  // Rquest next page
  useEffect(() => {
    if (!grid || !provider) return;

    fetchGetUserList(searchParams).then((data: UserListResponse) => {
      const rows = mappedRow(data?.results || []);
      addManyRows({
        gridView: grid,
        dataProvider: provider,
        rows: rows,
      });      
    });
  }, [searchParams])

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

