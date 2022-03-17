import React, {ReactElement, useEffect, useState} from 'react'
import WordRow from "./WordRow";
import axios from "axios";
import { render } from '@testing-library/react';
import { useNavigate } from "react-router-dom";
import {GlobalState, useStateMachine} from "little-state-machine";

type BoardProps = {
    length: number
    height: number
}

// start a default game for testing
axios.post('/newgame', {
    "player1": "test1",
    "player2": "test2"
}).then(r => {
    console.log(r.data)
})

export default function WordleBoard(props: BoardProps) {
    const { state } = useStateMachine();
    const [rowWords, setRowWords]: [string[], any] = useState([])
    const [rowColors, setRowColors]: [number[][], any] = useState([])
    const [curRow, setCurRow]: [number, any] = useState(0)
    const [responseText, setResponseText] = useState("")

    let rows: ReactElement[] = []
    for (let i = 0; i < props.length; i++) {
        rows.push(<WordRow length={props.length} letters={rowWords[i]} colors={rowColors[i]}/>)
    }
    useEffect(() => {
        console.log("Board updates")
    })
    return <div onKeyDown={(event) => {
        console.log(event.key)
        //You need to use the ellipses otherwise React wont trigger a rerender, it sees the new array as the same array
        let newRowWords = [...rowWords]
        let newRowColors = [...rowColors]
        if (event.key == 'Backspace') {
            newRowWords[curRow] = newRowWords[curRow] ? newRowWords[curRow].slice(0, -1) : newRowWords[curRow]
        }
        if (event.key == 'Enter') {
            if (newRowWords[curRow].length == 5) {
                axios.post('/check', {
                    "guess": newRowWords[curRow],
                    "user": state.username
                }).then(r => {
                    let newRow = []
                    for (let i = 0; i < r.data.response.length; i++) {
                        newRow.push(r.data.response[i][1])
                    }
                    console.log(newRow)
                    // check if game is won
                    if (newRow.every((c, i, arr) => c == 2)) {
                        setResponseText("You win!")
                        render(
                            <button onClick={()=> NewGame()}>New Game</button>
                        )
                        // TODO: lock the keyboard, offer play again button
                    }
                    newRowColors[curRow] = newRow
                    setRowColors(newRowColors)
                })
                setCurRow(curRow + 1)
            }
            else {
                setResponseText("Please enter a word of correct length")
            }
        }
        else if (event.key.length == 1 && event.key.match("[a-zA-Z]+")?.length == 1) {
            newRowWords[curRow] = newRowWords[curRow] ? newRowWords[curRow] + event.key.toUpperCase() : event.key.toUpperCase()
        }

        setRowWords(newRowWords)
        console.log(rowWords[curRow])
    }} tabIndex={0}>
        <p>{responseText}</p>
        {rows}
    </div>
}

function NewGame() {
    axios.post('/newgame', {
        "check": ''
    }).then(r => {
        console.log(r.data)
    })
    window.location.reload()
}