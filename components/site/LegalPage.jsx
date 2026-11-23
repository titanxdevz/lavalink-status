import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "./JsonLd";
import { Breadcrumbs, PageHeader, Section } from "./ui";

export function LegalPage({
    eyebrow,
    title,
    description,
    updated,
    icon,
    sections,
    jsonLd,
    intro,
}) {
    return (
        <div className="min-h-screen bg-ink-950 font-display text-white selection:bg-signal selection:text-ink-950">
            <Navbar />

            <main>
                <PageHeader
                    breadcrumbs={
                        <Breadcrumbs
                            items={[{ label: "Home", href: "/" }, { label: title }]}
                        />
                    }
                    eyebrow={eyebrow}
                    title={title}
                    description={description}
                    icon={icon}
                    meta={[
                        { label: "Updated", value: updated },
                        { label: "Sections", value: sections.length },
                    ]}
                />

                <Section>
                    <div className="grid gap-10 lg:grid-cols-12">
                        <aside className="lg:col-span-3">
                            <nav
                                aria-label="On this page"
                                className="border border-line bg-ink-900 p-4 lg:sticky lg:top-24"
                            >
                                <p className="font-data text-[10px] uppercase tracking-[0.18em] text-dim">
                                    On this page
                                </p>
                                <ol className="mt-3 space-y-2">
                                    {sections.map((section, index) => (
                                        <li key={section.id}>
                                            <a
                                                href={`#${section.id}`}
                                                className="flex items-baseline gap-2 text-sm text-dim transition-colors hover:text-white"
                                            >
                                                <span className="font-data text-[9px] tracking-[0.14em] text-signal">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                {section.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </aside>

                        <div className="space-y-4 lg:col-span-9">
                            {intro && (
                                <p className="max-w-3xl text-pretty text-base leading-relaxed text-dim">
                                    {intro}
                                </p>
                            )}

                            {sections.map((section) => (
                                <article
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-28 border border-line bg-ink-900 p-6 sm:p-8"
                                >
                                    <div className="flex items-baseline gap-3">
                                        <span className="font-data text-[10px] tracking-[0.14em] text-signal">
                                            {section.number}
                                        </span>
                                        <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
                                            {section.title}
                                        </h2>
                                    </div>

                                    <div className="mt-4 space-y-4 border-l border-line pl-4">
                                        {section.content.map((paragraph) => (
                                            <p
                                                key={paragraph}
                                                className="max-w-prose text-sm leading-relaxed text-dim sm:text-base"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}

                                        {section.list && (
                                            <ul className="space-y-2.5 pt-1">
                                                {section.list.map((item) => (
                                                    <li
                                                        key={item}
                                                        className="flex items-start gap-2.5"
                                                    >
                                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-signal" />
                                                        <span className="text-sm leading-relaxed text-dim">
                                                            {item}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </Section>
            </main>

            <Footer />

            <JsonLd data={jsonLd} />
        </div>
    );
}
