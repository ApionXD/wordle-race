import React, {SVGProps, useRef} from "react";
import {Layer, Rect, Stage, Text} from "react-konva"

function WordTile(props: any) {
    console.log(props.letter)
    return (
            <Stage width={48} height={48}>
                <Layer>
                    <Rect width={48} height={48} fill={"#3a3a3c"}/>
                </Layer>
                <Layer>
                    <Text text={props.letter} fontSize={24} align={"center"} fill={"white"} padding={12}/>
                </Layer>
            </Stage>
        )
}
export default WordTile