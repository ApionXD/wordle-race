import React from "react";
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
    const navigate = useNavigate()
    const submit = (size: number) => {
        actions.setBoardSize(size)
        axios.post('/queue', {
           "boardSize": size
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
    </div>)
}