import React, {useEffect, useState} from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useStateMachine} from "little-state-machine";
import MultipleWordleBoard from "./MultipleWordleBoard";

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
    const [p1words, setP1Words]: [string[], any] = useState([])
    const [p2words, setP2Words]: [string[], any] = useState([])
    const [rowColors, setRowColors]: [number[][], any] = useState([])
    const [curRow, setCurRow]: [number, any] = useState(0)

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

                    setP1Words(findBoards(values.player1board))
                    setP2Words(findBoards(values.player2board))
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
            <label>{winner}</label>
        </table>
        <MultipleWordleBoard length={state?.gameDetails?.boardsize!} height={5} p1words={p1words} p2words={p2words} player1={player1} player2={player2} curRow={curRow}></MultipleWordleBoard>
        <button onClick={() => { navigate('/')}}>Quit</button>
    </div>)
}

function findBoards(boards)
{
    let row = [[]]
    for (let i=0; i<boards.length; i++)
    {
        for (let j=0; j<boards[i].length; j++)
        {
             row[i] += boards[i][j]
        }
    }
    console.log(row)
    return row
}