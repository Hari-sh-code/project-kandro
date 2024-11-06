import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Header from "./Header";
import { BrowserRouter } from "react-router-dom";
import Datasets from "./Datasets";
import NavBar from "./NavBar";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="flex flex-row">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/datasets" element={<Datasets />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
