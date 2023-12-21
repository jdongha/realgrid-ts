import { useContext } from "react";
import { UserDataContext, UserDataDispatchContext } from "../dataset/UserDataContextProvider";

export const useUserDataContext = () => {
  const datasetDispatch = useContext(UserDataDispatchContext);
  const datasetState = useContext(UserDataContext);

  if (!datasetState)
    throw new Error("Expected to be wrapped in a UserDataContext");

  return { state: datasetState, dispatch: datasetDispatch };
};
