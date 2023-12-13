import "./App.css";

import "realgrid/dist/realgrid-style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import User from "./component/User";

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <User />
      </QueryClientProvider>
    </div>
  );
}

export default App;
