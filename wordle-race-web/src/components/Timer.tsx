import {useEffect, useState} from "react";

type TimerProps = {
    // The duration of the timer
    time: number
}
export default function Timer(props: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(props.time)

    useEffect(() => {
        if (timeLeft > 0) {
            let decTimer = setTimeout(() => {
                setTimeLeft(timeLeft => timeLeft - 1)
            }, 1000)
        }
    })
    return (
        <div style={{display: "flex", justifyContent: 'center'}}>
            <h2 style={{color: "white"}}>{Math.floor(timeLeft / 60)}: {timeLeft % 60 < 10 ? "0" + timeLeft % 60 : timeLeft % 60}</h2>
        </div>

    )
}