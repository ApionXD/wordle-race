import React, {useEffect, useState} from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useStateMachine} from "little-state-machine";

type GameOverProps = {

}
export default function GameOverPage(props: GameOverProps){
    const { state } = useStateMachine()
    const navigate = useNavigate()
    const [player1, setPlayer1] = useState("")
    const [player2, setPlayer2] = useState("")
    const [p1Score, setPlayer1Score] = useState(0)
    const [p2Score, setPlayer2Score] = useState(0)
    const [winner, setWinner] = useState("")
    useEffect(() => {
        if (winner=="")
        {
        axios.post('/gameresults', {
            "id": state?.gameDetails?.id
            }).then(r => {
                let values=r.data
                if (values.response=="Time Left")
                {
                    navigate('/')
                }
                else
                {
                    setPlayer1(values.player1)
                    setPlayer2(values.player2)
                    setPlayer1Score(values.player1score)
                    setPlayer2Score(values.player2score)
                    setWinner(values.winner)
                }
            })}
    }, [])
    const tableStyle = {
        color: 'white',
    }
    return (
    <div>
        <table style={tableStyle}>
            <tr>
                <th></th>
                <th>{player1}</th>
                <th>{player2}</th>
            </tr>
            <tr>
                <th>score:</th>
                <th>{p1Score}</th>
                <th>{p2Score}</th>
            </tr>
            <label>{winner} wins!</label>
        </table>
        <button onClick={() => { navigate('/')}}>Quit</button>
    </div>)
}