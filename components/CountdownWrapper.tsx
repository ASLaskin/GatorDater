"use client";

import dynamic from "next/dynamic";

const CountdownTimer = dynamic(() => import("./CountdownTimer"), { ssr: false });

export default function CountdownWrapper() {
    return <CountdownTimer />;
}