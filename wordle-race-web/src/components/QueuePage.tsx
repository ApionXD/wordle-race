import React, {useEffect, useState} from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {GlobalState, useStateMachine} from "little-state-machine";

type QueuePageProps = {

}

const setBoardSize = (state:GlobalState, boardSize: number) => ({
    ...state,
    gameDetails: {
        ...state.gameDetails,
        boardsize: boardSize
    }
})
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


export default function QueuePage(props: QueuePageProps){

    let {actions, state} = useStateMachine({
        setBoardSize,
        setGameOpponent,
        setGameId
    })
    const [status, setstatus] = useState("")
    const navigate = useNavigate()
    const submit = (size: number) => {
        actions.setBoardSize(size)
        axios.post('/queue', {
           "boardSize": size
        }).then((response) => {
           if (response.data.response === "Success") {
               setstatus("Looking for game with "+size+" letters!")
                let checkInterval = setInterval(() => {
                    axios.get("/check_game").then((response) => {
                        console.log(response.data)
                        if (response.data.status === "Game found") {
                            clearInterval(checkInterval)
                            console.log("Game found!")
                            setstatus("Found Game!")
                            actions.setGameOpponent(response.data.opponentName)
                            actions.setGameId(response.data.id)
                            navigate("/play")
                        }
                    })
                }, 5000)
           }
           else if (response.data.response === "Role too low")
           {
               setstatus("Your total score needs to be higher to play this mode!")
           }
        })
    }
    return (
    <div>
        <button onClick={() => {
            submit(4)
        }}>4 Letters</button>
        <button onClick={() => {
            submit(5)
        }}>5 Letters</button>
        <button onClick={() => {
            submit(6)
        }}>6 Letters</button>
        <button onClick={() => {
            submit(7)
        }}>7 Letters</button>
        <button onClick={() => {
            submit(8)
        }}>8 Letters</button>
        <button onClick={() => {
            submit(9)
        }}>9 Letters</button><br></br>
        <label>{status}</label>
    </div>)
}