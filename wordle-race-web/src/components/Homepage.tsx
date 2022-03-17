import {Link} from "react-router-dom";
import Button from "./Button";
import React from "react";
import {GlobalState, useStateMachine} from "little-state-machine";

type HomepageProps = {

}
const logOut = (state: GlobalState) => ({
    ...state,
    username: undefined
});

export default function Homepage(props: HomepageProps) {
    let {actions, state} = useStateMachine({
        logOut
    })
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
                      <label>Hello { state.username}<br/>
                      <Link to={"board"}>Board</Link><br/>
                      </label><Button color='green' text='Logout' onClick={actions.logOut} />
                      </> // need to make remove "name" as well refresh as well
                  }
              </nav>
    )
}