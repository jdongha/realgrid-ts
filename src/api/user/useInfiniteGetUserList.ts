import {
  InfiniteData,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Result, UserListResponse } from "./userListTypes";
import { ReactNode, useEffect } from "react";

/**
 * Free mockup data api: https://randomuser.me/documentation#pagination
 */

interface SeachParams {
  page: number;
  results: number;
}

export interface CallbackOptions<T = any> {
  mapper?: (original: InfiniteData<InfiniteUserListResponse | undefined>) => T;
}

export type InfiniteQueryOptionsType<T> =
  Omit<
    UseInfiniteQueryOptions<T, AxiosError, T, T, any>,
    "queryKey" | "queryFn"
  > & {};

export interface InfiniteUserListResponse {
  result: Result[];
  nextPageIndex: number;
  isLast: boolean;
}

const fetchInfiniteGetUserList = async (
  params: SeachParams
): Promise<InfiniteUserListResponse | undefined> => {
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

const useInfiniteGetUserList = <TMappedReturnData>(
  params: Omit<SeachParams, "page">,
  options?: InfiniteQueryOptionsType<UserListResponse>,
  callbackOptions?: CallbackOptions<TMappedReturnData>
) => {
  const initialPageParam = {
    page: 1,
    results: params.results || 20,
  };

  const query = useInfiniteQuery({
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

  /**
   * Optionally map the network error to a React component
   */
  let errorFallbackComponent: ReactNode | undefined;
  if (query.isError) {
    // errorFallbackComponent = mapErrorToFallbackComponent(error?.code)
  }

  /**
   * Optionally map response data to Component page props
   */
  let mappedData: TMappedReturnData | undefined;
  if (callbackOptions?.mapper && query.data !== undefined) {
    mappedData = callbackOptions.mapper(query.data)
    console.debug(`mappedData::: ${mappedData}`);
  }

  /**
   * Optionally take action in the event of a successful call
   */
  useEffect(() => {
    if (query.isSuccess) {
      // showToastNotification('Success!')
    }
  }, [query.isSuccess]);

  /**
   * Optionally take action in the event of a failed call
   */
  useEffect(() => {
    if (query.isError) {
      // showToastNotification('Error!')
    }
  }, [query.isError]);

  return { ...query, mappedData, errorFallbackComponent };
};

export { fetchInfiniteGetUserList, useInfiniteGetUserList };
