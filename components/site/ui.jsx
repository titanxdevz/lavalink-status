import Link from "next/link";
import { cn } from "@/lib/utils";

export function Container({ className, children }) {
    return <div className={cn("mx-auto w-full max-w-7xl px-6", className)}>{children}</div>;
}

export function Eyebrow({ className, children }) {
    return (
        <p
            className={cn(
                "font-data text-[10px] uppercase tracking-[0.22em] text-signal",
                className
            )}
        >
            {children}
        </p>
    );
}

const TONES = {
    signal: "text-signal border-signal/30 bg-signal/10",
    ok: "text-ok border-ok/30 bg-ok/10",
    warn: "text-warn border-warn/30 bg-warn/10",
    bad: "text-bad border-bad/30 bg-bad/10",
    dim: "text-dim border-line bg-ink-950",
};

export function Badge({ tone = "dim", className, children }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.16em]",
                TONES[tone] || TONES.dim,
                className
            )}
        >
            {children}
        </span>
    );
}

export function Breadcrumbs({ items }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 font-data text-[10px] uppercase tracking-[0.16em] text-dim">
                {items.map((item, index) => {
                    const last = index === items.length - 1;
                    return (
                        <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                            {index > 0 && (
                                <span aria-hidden="true" className="text-line">
                                    /
                                </span>
                            )}
                            {item.href && !last ? (
                                <Link href={item.href} className="transition-colors hover:text-white">
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current={last ? "page" : undefined} className="text-white">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export function PageHeader({
    eyebrow,
    title,
    description,
    icon: Icon,
    actions,
    meta = [],
    breadcrumbs,
}) {
    return (
        <header className="relative overflow-hidden border-b border-line">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-b" />
            <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-signal/10 blur-[120px]" />

            <Container className="relative py-14 sm:py-20">
                {breadcrumbs}

                <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

                        <div className="mt-4 flex items-start gap-4">
                            {Icon && (
                                <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center border border-signal/30 bg-signal/10 text-signal">
                                    <Icon size={20} />
                                </span>
                            )}
                            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                                {title}
                            </h1>
                        </div>

                        {description && (
                            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-dim sm:text-lg">
                                {description}
                            </p>
                        )}

                        {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>}
                    </div>

                    {meta.length > 0 && (
                        <dl className="grid w-full grid-cols-2 gap-px border border-line bg-line lg:w-auto lg:min-w-[280px]">
                            {meta.map((item) => (
                                <div key={item.label} className="bg-ink-950 px-4 py-3">
                                    <dt className="font-data text-[9px] uppercase tracking-[0.16em] text-dim">
                                        {item.label}
                                    </dt>
                                    <dd className="mt-1 truncate font-display text-lg font-semibold text-white tabular-nums">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </Container>
        </header>
    );
}

export function SectionHeader({ eyebrow, title, description, actions, className }) {
    return (
        <div className={cn("flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", className)}>
            <div className="max-w-2xl">
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {title}
                </h2>
                {description && (
                    <p className="mt-3 text-pretty text-base leading-relaxed text-dim">{description}</p>
                )}
            </div>
            {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

export function Section({ id, className, children, tone = "base" }) {
    return (
        <section
            id={id}
            className={cn(
                "border-b border-line",
                tone === "raised" ? "bg-ink-900" : "bg-ink-950",
                className
            )}
        >
            <Container className="py-16 sm:py-20">{children}</Container>
        </section>
    );
}

export function Panel({ as: Tag = "div", className, children, ...props }) {
    return (
        <Tag className={cn("border border-line bg-ink-900", className)} {...props}>
            {children}
        </Tag>
    );
}

export function actionClasses({ variant = "primary", size = "md", className } = {}) {
    const base =
        "inline-flex items-center justify-center gap-2 border font-data uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-50";
    const sizes = {
        sm: "h-9 px-3 text-[10px]",
        md: "h-11 px-5 text-[11px]",
    };
    const variants = {
        primary: "border-signal bg-signal font-semibold text-ink-950 hover:bg-signal-soft",
        secondary: "border-line bg-ink-900 text-white hover:border-signal/50 hover:text-signal",
        ghost: "border-transparent text-dim hover:text-white",
        danger: "border-bad/40 bg-bad/10 text-bad hover:bg-bad/20",
    };

    return cn(base, sizes[size] || sizes.md, variants[variant] || variants.primary, className);
}

export function ActionLink({ href, variant, size, className, children, ...props }) {
    return (
        <Link href={href} className={actionClasses({ variant, size, className })} {...props}>
            {children}
        </Link>
    );
}

export function ActionButton({ variant, size, className, children, ...props }) {
    return (
        <button type="button" className={actionClasses({ variant, size, className })} {...props}>
            {children}
        </button>
    );
}

export function StatCard({ label, value, hint, icon: Icon, tone = "signal", className }) {
    return (
        <div className={cn("border border-line bg-ink-900 p-4", className)}>
            <div className="flex items-center justify-between gap-2">
                <span className="font-data text-[9px] uppercase tracking-[0.16em] text-dim">{label}</span>
                {Icon && <Icon size={13} className={TONES[tone]?.split(" ")[0] || "text-signal"} />}
            </div>
            <div className="mt-2 font-display text-2xl font-semibold text-white tabular-nums">{value}</div>
            {hint && <p className="mt-1 text-xs leading-relaxed text-dim">{hint}</p>}
        </div>
    );
}

export function EmptyState({ icon: Icon, title, description, action, className }) {
    return (
        <div
            className={cn(
                "border border-dashed border-line px-6 py-16 text-center",
                className
            )}
        >
            {Icon && <Icon size={28} className="mx-auto text-dim" />}
            <h3 className="mt-4 font-display text-xl font-semibold text-white">{title}</h3>
            {description && (
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-dim">{description}</p>
            )}
            {action && <div className="mt-6 flex justify-center">{action}</div>}
        </div>
    );
}

export function Field({ label, hint, htmlFor, children, className }) {
    return (
        <div className={cn("space-y-2", className)}>
            <label
                htmlFor={htmlFor}
                className="block font-data text-[10px] uppercase tracking-[0.16em] text-dim"
            >
                {label}
            </label>
            {children}
            {hint && <p className="text-xs leading-relaxed text-dim/80">{hint}</p>}
        </div>
    );
}

export function inputClasses(className) {
    return cn(
        "h-11 w-full border border-line bg-ink-950 px-3 font-data text-xs text-white outline-none transition-colors placeholder:text-dim/60 focus:border-signal/60",
        className
    );
}
