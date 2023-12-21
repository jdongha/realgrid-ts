import "./App.css";

import "realgrid/dist/realgrid-style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import User from "./view/User";
import User2 from "./view/User2";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <User />
        <User2 />
      </QueryClientProvider>
    </div>
  );
}

export default App;
