import { columns } from "../grid/defination/userList.ds";
import InfiniteScrollGrid from "../grid/component/InfiniteScrollGrid";
import { useUserDataContext } from "../grid/hook/useUserDataContext";

export default function User2() {
  const { state, dispatch } = useUserDataContext();

  if (!state.dataProvider) return <></>;

  return (
    <>
      <h2>RealGrid2 - User List2 (Used Context dataset & Wrapping component)</h2>
      <InfiniteScrollGrid
        columns={columns}
        dataProvider={state.dataProvider}
        style={{ height: "500px", width: "100%" }}
        fetchNext={dispatch.fetchNext}
      />
    </>
  );
}
