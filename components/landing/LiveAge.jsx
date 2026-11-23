"use client";

import { useEffect, useState } from "react";
import { formatAge } from "@/hooks/useLandingNodes";

export function LiveAge({ timestamp, prefix = "Updated", className = "" }) {
    const [, setTick] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setTick((value) => value + 1), 15000);
        return () => clearInterval(id);
    }, []);

    return (
        <span className={className}>
            {prefix} {formatAge(timestamp)}
        </span>
    );
}
