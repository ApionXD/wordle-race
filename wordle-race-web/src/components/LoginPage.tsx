import React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {GlobalState, useStateMachine} from "little-state-machine";


type LoginProps = {

}
const updateName = (state: GlobalState, new_username: string) => ({
    ...state,
    username: new_username
});

export default function LoginPage(props: LoginProps){
    const navigate = useNavigate()
    let {actions, state} = useStateMachine({
        updateName
    })
    const submit = (event: any) => {
            event.preventDefault()
            let request = {
                "username": event.target.usernameForm.value,
                "password": event.target.passwordForm.value,
                "keep_session": event.target.rememberMe.value
            }
            axios.post("/login", request)
                .then((response) => {
                    let status = response.data.response
                    console.log(status)
                    if (status === "Success") {
                        actions.updateName(response.data.user)
                        navigate("/")
                    }
                })
        }
    return (
    <div>
        <form onSubmit={submit}>
            <label htmlFor={"usernameForm"}>Username</label> <br/>
            <input type={"text"} id={"usernameForm"} name={"usernameForm"}/> <br/>
            <label htmlFor={"passwordForm"}>Password</label> <br/>
            <input type={"password"} id={"passwordForm"} name={"passwordForm"}/><br/>
            <input type={"submit"} value={"Submit"}/> <br/>
            <input type={"radio"} id={"rememberMe"} name={"rememberMe"}/>
            <label htmlFor={"rememberMe"}>Remember Me</label>
        </form>
    </div>)
}