"use client";

import { ArrowUpRight, Megaphone } from "lucide-react";

export function PromotionCard({ promotion }) {
    if (!promotion) return null;

    const body = (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center border border-signal/30 bg-signal/10 text-signal">
                    <Megaphone size={15} />
                </span>
                <div className="min-w-0">
                    <div className="font-data text-[9px] uppercase tracking-[0.18em] text-dim">
                        Sponsored
                    </div>
                    <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-signal">
                        {promotion.title}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dim">
                        {promotion.content}
                    </p>
                </div>
            </div>

            {promotion.link && (
                <span className="inline-flex shrink-0 items-center gap-1.5 border border-line bg-ink-950 px-3 py-2 font-data text-[10px] uppercase tracking-[0.14em] text-white transition-colors group-hover:border-signal/50 group-hover:text-signal">
                    Visit
                    <ArrowUpRight size={12} />
                </span>
            )}
        </div>
    );

    const className =
        "group block border border-line bg-ink-900 p-5 transition-colors hover:border-signal/50";

    if (!promotion.link) {
        return <div className={className}>{body}</div>;
    }

    return (
        <a
            href={promotion.link}
            target="_blank"
            rel="noreferrer"
            className={className}
        >
            {body}
        </a>
    );
}
