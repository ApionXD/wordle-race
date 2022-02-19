import React, {ReactElement} from "react";
import WordTile from "./WordTile";

function WordRow(props: any): ReactElement {
    const letters: string[] = props.letters
    let tilesList = letters.map((letter: string) => (
        <div>
            <WordTile letter={letter}/>
            <text>BREAK</text>
        </div>

    ));
    return <>{tilesList}</>
}
export default WordRow