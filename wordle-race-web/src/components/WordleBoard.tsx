import React, {ReactElement} from 'react'
import WordRow from "./WordRow";

type BoardProps = {
    length: number
    height: number
}
export default function WordleBoard(props: BoardProps) {
    let rows: ReactElement[] = []
    for (let i = 0; i < props.length; i++) {
        rows.push(<WordRow length={props.length} />)
    }
    return <>{rows}</>
}