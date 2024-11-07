import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Header from "./Header";
import { BrowserRouter } from "react-router-dom";
import Datasets from "./Datasets/Datasets";
import NavBar from "./NavBar/";
import Models from "./Models/Models";
import Discussion from "./Discussion/Discussion";

import { DataProvider } from "./Context/DataContext";
import { UploadData } from "./Datasets/UploadData";

import ViewDataset from "./Datasets/ViewDataset";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="flex flex-row">
        <NavBar />

        <DataProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/datasets/:id" element={<ViewDataset />} />
            <Route path="/models" element={<Models />} />
            <Route path="/discussion" element={<Discussion />} />
            <Route path="/upload file" element={<UploadData />} />
          </Routes>
        </DataProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
