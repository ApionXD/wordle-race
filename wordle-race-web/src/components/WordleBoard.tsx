import React, {ReactElement, useEffect, useState} from 'react'
import WordRow from "./WordRow";
import axios from "axios";

type BoardProps = {
    length: number
    height: number
}
export default function WordleBoard(props: BoardProps) {
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
                    "guess": newRowWords[curRow]
                }).then(r => {
                    console.log(r.data)
                    let newRow = []
                    for (let i = 0; i < r.data.length; i++) {
                        newRow.push(r.data[i][1])
                    }
                    console.log(newRow)
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