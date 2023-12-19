import {
  DefinedInitialDataOptions,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { UserListResponse } from "./userListTypes";

/**
 * Free mockup data api: https://randomuser.me/documentation#pagination
 */

interface SeachParams {
  page: number;
  results: number; // 페이지 당 row개수
}

const fetchGetUserList = async (params: SeachParams) => {
  try {
    try {
      const response = await axios
        .get(
          `https://randomuser.me/api/?page=${params.page}&results=${params.results}`
        )
        .then((res) => {
          return res.data;
        });

      return response;
    } catch (error) {
      // handle error
      console.log(error);
    }
  } finally {
  }
};

const useGetUserList = (
  params: SeachParams,
  options?: DefinedInitialDataOptions<UserListResponse>
) => {
  return useQuery<UserListResponse>({
    ...options,
    queryKey: [`userList`, params],
    queryFn: () => fetchGetUserList(params),
    placeholderData: keepPreviousData,
  });
};

export { fetchGetUserList, useGetUserList };
