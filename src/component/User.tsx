import { GridView, LocalDataProvider } from "realgrid";
import { UserRow, columns, fields } from "../gridView/userListDefine";
import { useEffect, useRef } from "react";
import { useInfiniteGetUserList } from "../api/user/useInfiniteGetUserList";

export default function User() {
  const realgridElement = useRef<HTMLDivElement>(null);
  const { data, hasNextPage, fetchNextPage } = useInfiniteGetUserList({
    results: 20,
  });

  useEffect(() => {
    const container = realgridElement.current;
    if (!container) return;

    const provider = new LocalDataProvider(true);
    const grid = new GridView(container);

    // Lazy load data
    grid.onScrollToBottom = () => {
      if (hasNextPage) fetchNextPage();
      console.debug("Call onScrollToBottom");
    };

    grid.setDataSource(provider);
    provider.setFields(fields);
    grid.setColumns(columns);

    const rows: UserRow[] =
      data?.pages
        .flatMap((page) => page?.result)
        .map((result) => {
          if (!result) return {};

          return {
            name: `${result.name.first} ${result.name.last}`,
            email: result.email,
            age: result.dob.age,
            location: `${result.location.city} ${result.location.state} ${result.location.country}`,
          };
        }) || [];
    console.debug(data?.pages);
    // provider.fillJsonData(rows);
    provider.setRows(rows);

    return () => {
      provider.clearRows();
      grid.destroy();
      provider.destroy();
    };
  }, [data]);

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
