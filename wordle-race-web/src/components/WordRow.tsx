import React, {ReactElement} from "react";
import WordTile from "./WordTile";

type RowProps = {
    //The letters in the WordRow, optional
    letters?: string | undefined
    colors?: number[] | undefined
    //The length of the word row
    length: number
}
const rowStyle = {
    display: 'flex',
    justifyContent: 'center',
}

export default function WordRow(props: RowProps): ReactElement {
    let tilesList: ReactElement[] = []
    let letters = props.letters ? props.letters : []
    for (let i = 0; i < props.length; i++) {
        tilesList[i] = (
            <div style={{
                margin: '0.5%'
            }}>
                <WordTile letter={props?.letters?.at(i)} color={props.colors?.at(i)}/>
            </div>
            )
    }
    return <div style={rowStyle}>{tilesList}</div>
}