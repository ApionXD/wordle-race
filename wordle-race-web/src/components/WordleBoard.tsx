import React, {ReactElement, useEffect, useState} from 'react'
import WordRow from "./WordRow";
import axios from "axios";
import { render } from '@testing-library/react';
import { useNavigate } from "react-router-dom"
import {useStateMachine} from "little-state-machine";

type BoardProps = {
    length: number
    height: number
}
export default function WordleBoard(props: BoardProps) {
    const { state } =useStateMachine()
    const navigate = useNavigate()
    const [rowWords, setRowWords]: [string[], any] = useState([])
    const [rowColors, setRowColors]: [number[][], any] = useState([])
    const [curRow, setCurRow]: [number, any] = useState(0)
    const [responseText, setResponseText] = useState("")
    const [score, setScore] = useState(0)
    const [win, setWin] = useState(0)
    let rows: ReactElement[] = []
    for (let i = 0; i < props.height; i++) {
        rows.push(<WordRow length={props.length} letters={rowWords[i]} colors={rowColors[i]}/>)
    }
    useEffect(() => {
        console.log("Board updates")
    })
    useEffect(() => {
        if (win == 1) {
            console.log("game ended")
            setRowWords([])
            setRowColors([])
            setWin(0)
        }
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
            if (newRowWords[curRow].length == props.length) {
                axios.post('/check', {
                    "id": state?.gameDetails?.id,
                    "guess": newRowWords[curRow],
                    "curRow": curRow
                }).then(r => {
                    let response = r.data.response
                    console.log(response)
                    if (response=="Success")
                    {
                        console.log(r.data)
                        let newRow = r.data.colors
                        console.log(newRow)
                        setScore(r.data.score)
                        // check if game is won or max size
                        let wonGame = newRow.every((i: number) => i == 2)
                        if (wonGame || curRow>=props.height-1) {
                            if (wonGame)
                            {
                                setResponseText("Correct!")
                                newRowColors[curRow] = newRow
                                setRowColors(newRowColors)
                                setTimeout(function() {
                                    NewGame()
                                    for (let i = 0; i < curRow+1; i++) {
                                        newRowColors[i] = new Array(newRowColors[i].length).fill(0)
                                    }
                                    setRowColors(newRowColors)
                                    setWin(1)
                                }, 2000)
                            }
                            else {
                                setResponseText("Out of guesses!")
                                newRowColors[curRow] = newRow
                                setRowColors(newRowColors)
                                setTimeout(function() {
                                    NewGame()
                                    for (let i = 0; i < curRow+1; i++) {
                                        newRowColors[i] = new Array(newRowColors[i].length).fill(0)
                                    }
                                    setRowColors(newRowColors)
                                    setWin(1)
                                }, 2000)
                            }
                            
                            // TODO: lock the keyboard, offer play again button
                        }
                        if (!wonGame && curRow<props.height-1) {
                            console.log('not won')
                            newRowColors[curRow] = newRow
                            setRowColors(newRowColors)
                            setCurRow(curRow + 1)
                        }
                        else
                            setCurRow(0)
                        setResponseText("")
                    }
                    else if (response == "Time's up") {
                        navigate("/gameover")
                    }
                    else
                    {
                        let temp = newRowWords[curRow]
                        newRowWords[curRow] = ""
                        console.log(newRowColors[curRow])
                        setResponseText(temp.at(0)+temp.substring(1).toLowerCase()+" is not a word")
                    }
                })
            }
            else {
                setResponseText("Please enter a word of correct length")
            }
        }
        else if (event.key.length == 1 && event.key.match("[a-zA-Z]+")?.length == 1 && (!newRowWords[curRow] || newRowWords[curRow].length<props.length)) {
            newRowWords[curRow] = newRowWords[curRow] ? newRowWords[curRow] + event.key.toUpperCase() : event.key.toUpperCase()
            if (newRowWords[curRow].length>5)
            {
                newRowWords[curRow].slice(0, -1)
            }
        }
        setRowWords(newRowWords)
        console.log(rowWords[curRow])
    }} tabIndex={0}>
        <p>{responseText}</p>
        {rows}
        <label>Score: {score}</label>
    </div>
}

function NewGame() {
    axios.post('/newboard').then(r => {
        console.log(r.data)
    })
}