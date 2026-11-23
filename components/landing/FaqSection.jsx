import { FAQS } from "@/lib/site";

export function FaqSection() {
    return (
        <section className="border-b border-line bg-ink-900">
            <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
                <div className="max-w-2xl">
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Questions, answered.
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-dim">
                        The short version of how the directory works and what to expect from a
                        public node.
                    </p>
                </div>

                <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
                    {FAQS.map((faq, index) => (
                        <div key={faq.question} className="border-t border-line pt-5">
                            <div className="flex items-baseline gap-4">
                                <span className="font-data text-[10px] tracking-[0.14em] text-signal">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3 className="font-display text-lg font-medium tracking-tight text-white">
                                    {faq.question}
                                </h3>
                            </div>
                            <p className="mt-3 max-w-prose pl-8 text-sm leading-relaxed text-dim">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
