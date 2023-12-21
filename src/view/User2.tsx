import { UserRow, columns, fields } from "../grid/defination/userList.ds";
import { useCallback, useEffect, useState } from "react";
import { Result, UserListResponse } from "../api/user/userListTypes";
import { fetchGetUserList } from "../api/user/useGetUserList";
import InfiniteScrollGrid from "../grid/component/InfiniteScrollGrid";

const init_params = { page: 1, results: 20 };

export default function User2() {
  const [searchParams, setSearchParams] = useState(init_params);
  const [rows, setRows] = useState<UserRow[]>([]);

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
    fetchGetUserList(searchParams).then((data: UserListResponse) => {
      const rows = mappedRow(data?.results || []);
      const isInitRows = searchParams.page === 1;
      isInitRows && setRows(rows);
    });
  }, [mappedRow]);

  const fetchNext = () => {
    const nextPageParam = {
      ...searchParams,
      page: searchParams.page + 1
    }
    setSearchParams(nextPageParam);
    
    return fetchGetUserList(nextPageParam).then((res: UserListResponse)  => mappedRow(res?.results || []))
  }

  if (!rows) return <></>;

  return (
    <>
      <h2>RealGrid2 - User List2 (Used Wrapping component)</h2>
      <InfiniteScrollGrid
        columns={columns}
        fields={fields}
        rows={rows}
        style={{ height: "500px", width: "100%" }}
        fetchNext={fetchNext}
      />
    </>
  );
}
