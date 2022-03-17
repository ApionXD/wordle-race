import React from "react";
import axios from "axios";
import {Navigate, useNavigate} from "react-router-dom";
import Button from "./Button";

type LogoutProps = {

}
export default function LogoutPage(props: LogoutProps)
{
    axios("/logout")
    .then((response) => {
        console.log(response)
    })
    return (<Button color='green' text='Logout' onClick={() => logout()} />) 
}

function logout(): any 
{
    sessionStorage.setItem("name", "");
    window.location.reload(); 
}