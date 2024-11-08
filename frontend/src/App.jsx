import React, { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Home/Home";
import Header from "./Header";
import Datasets from "./Datasets/Datasets";
import Models from "./Models/Models";
import Discussion from "./Discussion/Discussion";
import { DataProvider } from "./Context/DataContext";
import { UploadData } from "./Datasets/UploadData";
import ViewDataset from "./Datasets/ViewDataset";
import NavBar from "./Navbar"; // Import ConnectWallet component
import ConnectWallet from "./Datasets/login/ConnectWallet ";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setIsConnected(accounts.length > 0);
      });
    }
  }, []);

  return (
    <BrowserRouter>
      {isConnected ? (
        <>
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
        </>
      ) : (
        <ConnectWallet onConnect={() => setIsConnected(true)} />
      )}
    </BrowserRouter>
  );
}

export default App;
