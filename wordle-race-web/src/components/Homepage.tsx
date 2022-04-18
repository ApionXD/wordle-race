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
const setGameDetails = (state: GlobalState, opponentName: string) => ({
    ...state,
    gameDetails: {
        opponent: opponentName
    }
});

export default function Homepage(props: HomepageProps) {
    let {actions, state} = useStateMachine({
        logOut,
        setGameDetails
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
                          axios.post("/queue").then((response) => {
                              if (response.data.response === "Success") {
                                  let checkInterval = setInterval(() => {
                                      axios.get("/check_game").then((response) => {
                                          console.log(response.data)
                                          if (response.data.status === "Game found") {
                                              clearInterval(checkInterval)
                                              console.log("Game found!")
                                              actions.setGameDetails(response.data.opponentName)
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
                      </> // need to make remove "name" as well refresh as well
                  }
              </nav>
    )
}