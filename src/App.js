import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./Home";
import Create from "./Create";
import Update from "./Update";

function App() {
  return (
      <>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<Create />} />
                  <Route path="/:id/update" element={<Update />} />
              </Routes>
          </Router>
      </>
  );
}

export default App;
