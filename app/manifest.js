import { SITE } from "@/lib/site";

export default function manifest() {
    return {
        name: SITE.name,
        short_name: SITE.shortName,
        description: SITE.description,
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: SITE.backgroundColor,
        theme_color: SITE.themeColor,
        lang: "en",
        dir: "ltr",
        categories: ["developer", "utilities", "music"],
        icons: [
            {
                src: "/stackryze_logo_white.png",
                sizes: "any",
                type: "image/png",
                purpose: "any",
            },
        ],
    };
}
