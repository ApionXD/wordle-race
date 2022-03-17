import React from 'react';
import './App.css';
import {Link, Routes, Outlet} from "react-router-dom";
import {Route} from "react-router";
import WordRow from "./components/WordRow";
import WordleBoard from "./components/WordleBoard";
import LoginPage from "./components/LoginPage"
import {createStore, StateMachineProvider, useStateMachine, GlobalState} from "little-state-machine";

createStore({
    username: undefined
});

function App() {
  return (
      <StateMachineProvider>
        <div className="App">
        <Routes>
            <Route path={"/"} element={
                <div>
                    <nav>
                        <Link to={"board"}>Board</Link><br/>
                        <Link to={"login"}>Login</Link>
                    </nav>
                </div>
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
      </StateMachineProvider>
  );
}

export default App;