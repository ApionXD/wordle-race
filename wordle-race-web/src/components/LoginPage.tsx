import React from "react";
import axios from "axios";
import {Navigate, useNavigate} from "react-router-dom";

type LoginProps = {

}
export default function LoginPage(props: LoginProps){
    const navigate = useNavigate()
    const submit = (event: any) => {
            event.preventDefault()
            let request = {
                "username": event.target.usernameForm.value,
                "password": event.target.passwordForm.value
            }
            axios.post("/login", request)
                .then((response) => {
                    const status = response.data.response //made this store access token as well
                    const name = response.data.name
                    console.log(status)
                    if (status.startsWith("Success")) 
                    {
                        sessionStorage.setItem("name", name)
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