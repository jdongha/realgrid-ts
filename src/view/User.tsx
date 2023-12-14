import { UserRow, columns, fields } from "../grid/defination/userList.ds";
import { useCallback, useEffect, useRef } from "react";
import {
  InfiniteUserListResponse,
  useInfiniteGetUserList,
} from "../api/user/useInfiniteGetUserList";
import { useRealGrid } from "../grid/hooks/realGrid/useRealGrid";
import { InfiniteData } from "@tanstack/react-query";

export default function User() {
  // Function to convert API response to rows
  const rowMapper = useCallback((data: InfiniteData<InfiniteUserListResponse | undefined>) => {
    return (
      data?.pages
        .flatMap((page) => page?.result)
        .map((result) => {
          if(!result) return {};
          return {
            name: `${result.name.first} ${result.name.last}`,
            email: result.email,
            age: result.dob.age,
            location: `${result.location.city} ${result.location.state} ${result.location.country}`,
          }
        }) || []
    );
  }, []);

  // Hook to call API
  const { hasNextPage, fetchNextPage, data, mappedData } = useInfiniteGetUserList(
    {
      results: 20,
    },
    // undefined,
    // {
    //   // API 데이터 수신완료 시 rowMapper함수로 치환, 치환한 데이터는 'mappedData'로 리턴한다. (Original data var: 'data')
    //   mapper: rowMapper, 
    // }
  );

  // Get RealGrid essential object
  const realgridElement = useRef<HTMLDivElement>(null); // Grid Container
  const { gridView: gv, localDataProvider: dp, setRows } = useRealGrid<UserRow>({
    gridContainer: realgridElement.current,
    columns: columns,
    dataFields: fields,
  });

  // Optional: Set lazy load callback
  useEffect(() => {
    if (!gv) {
      console.error(`GridView undefined`);
      return;
    }

    gv.onScrollToBottom = () => {
      if (hasNextPage) fetchNextPage();
    };
    
    console.debug(`Complete onScrollToButton`);
  }, [gv, fetchNextPage, hasNextPage]);

  // Set rows
  useEffect(() => {
    if(!rowMapper || !dp || !data) {
      console.error(`DataProvider undefined`);
      return;
    }
    
    dp.setRows(rowMapper(data));
  }, [data, rowMapper, dp]);

  return (
    <>
      <h2>RealGrid2 - User List (Infinite scroll)</h2>
      <div
        style={{ height: "500px", width: "100%" }}
        ref={realgridElement}
      ></div>
    </>
  );
}
