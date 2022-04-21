import React from "react";
import axios from "axios";
import {Navigate, useNavigate} from "react-router-dom";
import {useStateMachine} from "little-state-machine";

type GameOverProps = {

}
export default function GameOverPage(props: GameOverProps){
    const { state } = useStateMachine()
    const navigate = useNavigate()
    axios.get("/gameresults").then(r => {
        console.log(r.data)
    })
    const tableStyle = {
        color: 'white',
    }
    return (
    <div>
        <table style={tableStyle}>
            <tr>
                <th></th>
                <th>player 1</th>
                <th>player 2</th>
            </tr>
            <tr>
                <th>score:</th>
                <th>player 1 score</th>
                <th>player 2 score</th>
            </tr>
            <label>you win/lose!</label>
        </table>
    </div>)
}