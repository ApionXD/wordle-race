import React from 'react';
import './App.css';
import {Link, Routes, Outlet} from "react-router-dom";
import {Route} from "react-router";
import WordRow from "./components/WordRow";
import WordleBoard from "./components/WordleBoard";
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import Button from "./components/Button"
import LogoutPage from './components/Logout';

function App() {
  const name = sessionStorage.getItem("name")
  return (
    <div className="App">
      <Routes>
          <Route path={"/"} element={
              <nav>
                  { name=="" || name==undefined ?
                    <>
                    <Link to={"board"}>Board</Link><br/>
                    <Link to={"login"}>Login</Link><br />
                    <Link to={"register"}>Register</Link>
                    </>
                    :
                      <>
                      <label>Hello { sessionStorage.getItem("name")}<br/> 
                      <Link to={"board"}>Board</Link><br/>
                      </label><LogoutPage/>
                      </> 
                  }
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
          <Route path={"/register"} element={
              <div>
                  <RegisterPage/>
              </div>
          }/>
      </Routes>
    </div>
  );
}

export default App;



