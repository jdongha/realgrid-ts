import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { UserListResponse } from "./userListTypes";

/**
 * Free mockup data api: https://randomuser.me/documentation#pagination
 */

interface SeachParams {
  page: number;
  results: number;
}

export type InfiniteQueryOptionsType<T> = Omit<
  UseInfiniteQueryOptions<T, AxiosError, T, T, any>,
  "queryKey" | "queryFn"
> & {};

const fetchInfiniteGetUserList = async (params: SeachParams) => {
  try {
    try {
      const response: UserListResponse = await axios
        .get(
          `https://randomuser.me/api/?page=${params.page}&results=${params.results}`
        )
        .then((res) => {
          return res.data;
        });

      console.log(response);

      return {
        result: response.results,
        nextPageIndex: response.info.page + 1,
        isLast: response.info.page === 20, // test api라 임의 설정
      };
    } catch (error) {
      // handle error
      console.log(error);
    }
  } finally {
  }
};

const useInfiniteGetUserList = (params: Omit<SeachParams, "page">) => {
  const initialPageParam = {
    page: 1,
    results: params.results || 20,
  };

  return useInfiniteQuery({
    queryKey: [`userList`],
    queryFn: () => fetchInfiniteGetUserList(initialPageParam),
    initialPageParam: initialPageParam,
    getNextPageParam: (lastPage) => {
      if (lastPage !== null && !lastPage?.isLast) {
        return {
          page: lastPage?.nextPageIndex,
          results: params.results,
        };
      }
      return undefined;
    },
  });
};

export { fetchInfiniteGetUserList, useInfiniteGetUserList };
