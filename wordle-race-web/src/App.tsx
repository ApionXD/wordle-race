import React from 'react';
import './App.css';
import {Routes} from "react-router-dom";
import {Route} from "react-router";
import WordRow from "./components/WordRow";
import WordleBoard from "./components/WordleBoard";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path={"/"} element={
              <div>
                  <WordleBoard length={5} height={5} />
              </div>

          }> </Route>
      </Routes>
    </div>
  );
}

export default App;