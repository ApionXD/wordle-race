import React from 'react';
import './App.css';
import {Routes} from "react-router-dom";
import {Route} from "react-router";
import LoginPage from "./components/LoginPage"
import QueuePage from "./components/QueuePage"
import {createStore, StateMachineProvider} from "little-state-machine";
import RegisterPage from "./components/RegisterPage"
import Homepage from "./components/Homepage";
import GameOverPage from "./components/GameOverPage"
import SessionRestore from "./wrappers/SessionRestore";
import PlayPage from "./components/PlayPage";

createStore({
    username: undefined,
    gameDetails: undefined
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
                        <QueuePage/>
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
                <Route path={"/play"} element={
                  <div>
                      <PlayPage/>
                  </div>
              }/>
                <Route path={"/prequeue"} element={
                  <div>
                      <QueuePage/>
                  </div>
              }/>
              <Route path={"/gameover"} element={
                  <div>
                      <GameOverPage/>
                  </div>
              }/>
            </Routes>
        </SessionRestore>
      </StateMachineProvider>
  );
}

export default App;


