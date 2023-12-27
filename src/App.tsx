import "./App.css";

import "realgrid/dist/realgrid-style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import User from "./view/User";
import DataContextWrappedUser from "./view/DataContextWrappedUser";
import { UserDataContextProvider } from "./grid/dataset/UserDataContextProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <User />
        <UserDataContextProvider>
          <DataContextWrappedUser />
        </UserDataContextProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
