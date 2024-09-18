
import ChatApp from "./Components/ChatApp/ChatApp";
import LineGraph from "./Components/LineGraph/LineGraph";
import DataTable from "./Components/MainTable/DataTable";
import "./index.scss";

function App() {
  return (
    <>
      <div className="app-container">
        <DataTable />

        <LineGraph />
        <ChatApp />
      </div>
    </>
  );
}

export default App;
