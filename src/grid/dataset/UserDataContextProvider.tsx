import { createContext, useCallback, useState } from "react";
import { useEffect } from "react";
import { LocalDataProvider } from "realgrid";
import {
  useInfiniteGetUserList,
} from "../../api/user/useInfiniteGetUserList";
import { useDataProvider } from "../hook/useRealGrid";
import { fields } from "../defination/userList.ds";
import { Result } from "../../api/user/userListTypes";

interface UserData {
  dataProvider?: LocalDataProvider;
}

interface UserDataDispatch {
  fetchNext: () => void;
}

const initialState: UserData = {};

export const UserDataContext = createContext<UserData>(
  initialState
);

export const UserDataDispatchContext = createContext<
  UserDataDispatch
>({} as UserDataDispatch);

const init_params = { page: 1, results: 20 };

export const UserDataContextProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [searchParams, setSearchParams] = useState(init_params);
  const {
    data: usersResponse,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteGetUserList({ results: 20 });
  const dataProvider = useDataProvider({
    dataFields: fields,
    undoable: true,
  });

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

  // init dataset rows
  useEffect(() => {
    if(!dataProvider) return;
    if (!usersResponse || usersResponse?.pages.length !== 1) return;

    const data = usersResponse?.pages[0]?.result || [];
    dataProvider?.setRows(mappedRow(data));
  }, [dataProvider, mappedRow, usersResponse]);

  const fetchNext = () => {
    if (!hasNextPage) return;

    fetchNextPage().then(res => {
      if(!res.data) return;
      const last = res.data?.pages.length - 1;
      const data = res.data?.pages[last]?.result || [];
      dataProvider?.addRows(mappedRow(data));
    })
  };
  return (
    <UserDataContext.Provider value={{ dataProvider }}>
      <UserDataDispatchContext.Provider value={{ fetchNext }}>
        {children}
      </UserDataDispatchContext.Provider>
    </UserDataContext.Provider>
  );
};
