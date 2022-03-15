import React from 'react';
import './App.css';
import {Link, Routes, Outlet} from "react-router-dom";
import {Route} from "react-router";
import WordRow from "./components/WordRow";
import WordleBoard from "./components/WordleBoard";
import LoginPage from "./components/LoginPage"

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path={"/"} element={
              <nav>
                  <Link to={"board"}>Board</Link><br/>
                  <Link to={"login"}>Login</Link>
              </nav>
          }/>
          <Route path={"/board"} element={
                  <div>
                      <WordleBoard length={5} height={5} />
                  </div>
              }> </Route>
          <Route path={"/login"} element={
              <div>
                  <LoginPage/>
              </div>
          }/>
      </Routes>
    </div>
  );
}

export default App;