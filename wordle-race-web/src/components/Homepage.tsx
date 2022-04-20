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

export default function Homepage(props: HomepageProps) {
    let {actions, state} = useStateMachine({
        logOut,
    })
    const navigate = useNavigate()
    return (
        <nav>
                  { !state.username ?
                    <>
                    <Link to={"login"}>Login</Link><br />
                    <Link to={"register"}>Register</Link>
                    </>
                    :
                      <>
                      <label>Hello { state.username}<br/></label>
                      <Link to={"/prequeue"}>Play</Link>
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