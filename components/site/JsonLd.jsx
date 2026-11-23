export function JsonLd({ data }) {
    const payload = (Array.isArray(data) ? data : [data]).filter(Boolean);

    return (
        <>
            {payload.map((item, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
                />
            ))}
        </>
    );
}
