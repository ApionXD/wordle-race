import React from 'react';
import './App.css';
import {Routes} from "react-router-dom";
import {Route} from "react-router";
import WordRow from "./components/WordRow";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path={"/"} element={<WordRow letters={["H", "E", "L", "L", "O", "W", "O", "R", "L", "D"]}/>}> </Route>
      </Routes>
    </div>
  );
}

export default App;