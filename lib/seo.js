import { SITE } from "./site";

function absolute(path = "/") {
    if (/^https?:\/\//i.test(path)) return path;
    return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.name,
        alternateName: "Lavalink List",
        url: SITE.url,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": `${SITE.url}/#organization` },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE.url}/?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: absolute(SITE.logo),
        description: SITE.description,
        sameAs: [SITE.discord, SITE.github],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "community support",
            url: SITE.discord,
            availableLanguage: ["en"],
        },
    };
}

export function webPageJsonLd({ title, description, path = "/", type = "WebPage" }) {
    return {
        "@context": "https://schema.org",
        "@type": type,
        name: title,
        description,
        url: absolute(path),
        isPartOf: { "@id": `${SITE.url}/#website` },
        about: { "@id": `${SITE.url}/#organization` },
        inLanguage: "en",
        primaryImageOfPage: { "@type": "ImageObject", url: absolute("/opengraph-image") },
    };
}

export function breadcrumbJsonLd(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: absolute(item.href),
        })),
    };
}

export function faqJsonLd(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

export function itemListJsonLd({ name, description, items, itemType = "Service" }) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        description,
        numberOfItems: items.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": itemType,
                name: item.name,
                ...(item.description ? { description: item.description } : {}),
                ...(item.url ? { url: absolute(item.url) } : {}),
                ...(item.provider
                    ? { provider: { "@type": "Organization", name: item.provider } }
                    : {}),
            },
        })),
    };
}

export function howToJsonLd({ name, description, steps }) {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name,
        description,
        step: steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
            ...(step.url ? { url: absolute(step.url) } : {}),
        })),
    };
}

export function personJsonLd({ id, name, description, image, url }) {
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
            "@type": "Person",
            name,
            description,
            ...(image ? { image: absolute(image) } : {}),
            ...(url ? { url: absolute(url) } : {}),
            identifier: id,
        },
    };
}
