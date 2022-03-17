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
                "password": event.target.passwordForm.value
            }
            axios.post("/login", request)
                .then((response) => {
                    const status = response.data.response //made this store access token as well
                    const token = response.data.token
                    const name = response.data.name
                    console.log(status)
                    if (status === "Success") {
                        sessionStorage.setItem("token", token);
                        sessionStorage.setItem("name", name)
                        actions.updateName(response.data.user)
                        console.log(state.username)
                        navigate("/")
                        window.location.reload();
                        //document.location.reload() BAd way to reload to save changes need to think of different way
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
            <input type={"submit"} value={"Submit"}/>
        </form>
    </div>)
}