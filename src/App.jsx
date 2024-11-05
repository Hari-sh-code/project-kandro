import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import NavBar from "./NavBar";
import { BrowserRouter } from "react-router-dom";
import Datasets from "./Datasets";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/datasets" element={<Datasets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
