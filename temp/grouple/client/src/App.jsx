import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./components/Signin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
