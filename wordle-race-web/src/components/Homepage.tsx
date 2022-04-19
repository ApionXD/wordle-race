import {Link, useNavigate} from "react-router-dom";
import React from "react";
import {GlobalState, useStateMachine} from "little-state-machine";
import axios from "axios";

type HomepageProps = {

}
const logOut = (state: GlobalState) => ({
    ...state,
    username: undefined
});
const setGameOpponent = (state: GlobalState, opponentName: string) => ({
    ...state,
    gameDetails: {
        ...state.gameDetails,
        opponent: opponentName
    }
});
const setGameId = (state: GlobalState, id: string) => ({
    ...state,
    gameDetails: {
        ...state.gameDetails,
        id: id
    }
});

export default function Homepage(props: HomepageProps) {
    let {actions, state} = useStateMachine({
        logOut,
        setGameOpponent,
        setGameId
    })
    const navigate = useNavigate()
    return (
        <nav>
                  { !state.username ?
                    <>
                    <Link to={"board"}>Board</Link><br/>
                    <Link to={"login"}>Login</Link><br />
                    <Link to={"register"}>Register</Link>
                    </>
                    :
                      <>
                      <label>Hello { state.username}<br/></label>
                      <button style={{backgroundColor: "green"}} onClick={() => {
                          axios.post("/queue", {
                              "boardsize": state?.gameDetails?.boardsize
                            }).then((response) => {
                              if (response.data.response === "Success") {
                                  let checkInterval = setInterval(() => {
                                      axios.get("/check_game").then((response) => {
                                          console.log(response.data)
                                          if (response.data.status === "Game found") {
                                              clearInterval(checkInterval)
                                              console.log("Game found!")
                                              actions.setGameOpponent(response.data.opponentName)
                                              actions.setGameId(response.data.id)
                                              navigate("/play")
                                          }
                                      })
                                  }, 10000)
                              }
                          })

                      }}>
                      Play</button>
                      <button style={{backgroundColor: "green"}} onClick={() => {
                          actions.logOut(undefined)
                          axios.get("/logout")
                      }}>
                      Logout</button>
                      <br/><Link to={"board"}>Board Size</Link><br/>
                      </> // need to make remove "name" as well refresh as well
                  }
              </nav>
    )
}