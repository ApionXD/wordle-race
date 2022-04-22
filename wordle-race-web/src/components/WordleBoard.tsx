import React, {ReactElement, useEffect} from 'react'
import WordRow from "./WordRow";

type BoardProps = {
    length: number
    height: number
    rowWords?: string[] | undefined
    rowColors?: number[][] | undefined
    curRow: number
}
export default function WordleBoard(props: BoardProps) {
    let rows: ReactElement[] = []
    for (let i = 0; i < props.height; i++) {
        rows.push(<WordRow length={props.length} letters={props?.rowWords[i]} colors={props?.rowColors[i]}/>)
    }
    useEffect(() => {
        console.log("Board updates")
    })
    return <div>
        {rows}
    </div>
}
