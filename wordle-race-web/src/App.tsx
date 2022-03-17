import React from 'react';
import './App.css';
import {Routes} from "react-router-dom";
import {Route} from "react-router";
import WordleBoard from "./components/WordleBoard";
import LoginPage from "./components/LoginPage"
import {createStore, StateMachineProvider, useStateMachine, GlobalState} from "little-state-machine";
import RegisterPage from "./components/RegisterPage"
import Homepage from "./components/Homepage";
import SessionRestore from "./wrappers/SessionRestore";

createStore({
    username: undefined
})

function App() {
  return (
    <StateMachineProvider>
        <SessionRestore>
            <Routes>
                <Route path={"/"} element={
                    <Homepage/>
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
        </SessionRestore>
      </StateMachineProvider>
  );
}

export default App;


