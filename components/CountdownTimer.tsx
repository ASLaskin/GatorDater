"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CountdownTimer() {
    const getTargetTime = () => {
        const now = new Date();
        const target = new Date();
        target.setHours(14, 0, 0, 0); // 2 PM EST

        if (now > target) {
            target.setDate(target.getDate() + 1);
        }

        return target;
    };

    const calculateTimeLeft = () => {
        const now = new Date()
        const target = getTargetTime()
        const difference = target.getTime() - now.getTime()

        if (difference <= 0) {
            return { hours: 0, minutes: 0, seconds: 0 }
        }

        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        return { hours, minutes, seconds }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft);

            // Calculate progress (remaining time / full 24-hour period)
            const now = new Date().getTime()
            const target = getTargetTime().getTime()
            const totalSeconds = (target - (target - 24 * 60 * 60 * 1000)) / 1000 // 24-hour period
            const remainingSeconds = (target - now) / 1000
            setProgress((remainingSeconds / totalSeconds) * 100)
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <Card className="w-full max-w-md p-8 flex flex-col border-none items-center gap-8 bg-white/80">
            <div className="relative flex items-center justify-center">
                <div className="absolute">
                    <Progress
                        value={progress}
                        className="w-[300px] h-[300px] [&>div]:h-full [&>div]:w-full [&>div]:rounded-full"
                    />
                </div>
                <div className="z-10 size-[280px] rounded-full border-4 border-primary/20 flex items-center justify-center bg-background">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Heart className="text-rose-500 size-8 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">Next Match In</h2>
                        <div className="text-4xl font-bold tabular-nums">
                            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
                            {String(timeLeft.seconds).padStart(2, "0")}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}