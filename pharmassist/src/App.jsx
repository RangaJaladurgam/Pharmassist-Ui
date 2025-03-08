import "./App.css";
import Register from "./Components/Register";
import Welcome from "./Components/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register/>}/>
          </Route>
        </Routes>
      </div>
    </>
  );
}

const AppWrapper = () => (
  <Router>
    <NavBar />
    <div className="container">
      <App />
    </div>
  </Router>
);

export default AppWrapper;
