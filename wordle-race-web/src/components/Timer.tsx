import {useEffect, useState} from "react";

type TimerProps = {
    // The duration of the timer
    time: number
}
export default function Timer(props: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(props.time)
    const initTimer = () => {
        const decTimer = setInterval(() => {
            console.log("Decrement timer")
            if (timeLeft == 0) {
                console.log("Stopped timer")
                clearInterval(decTimer)
            }
            else {
                console.log("Changed time left")
                setTimeLeft(timeLeft => timeLeft - 1)
            }
        }, 1000)
    }
    useEffect(() => {
        initTimer()
    }, [])
    return (
        <div style={{display: "flex", justifyContent: 'center'}}>
            <h2 style={{color: "white"}}>{Math.floor(timeLeft / 60)}: {timeLeft % 60 < 10 ? "0" + timeLeft % 60 : timeLeft % 60}</h2>
        </div>

    )
}