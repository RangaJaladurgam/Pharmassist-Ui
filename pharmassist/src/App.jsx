import "./App.css";
import Welcome from "./Components/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route>
            <Route path="/" element={<Welcome />} />
            {/* <Route path="/login" element={}/> */}
          </Route>
        </Routes>
      </div>
    </>
  );
}

const AppWrapper = () => (
  <Router>
    <div className="container">
      <App />
    </div>
  </Router>
);

export default AppWrapper;
