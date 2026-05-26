const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://dectra.in/#website",
      url: "https://dectra.in",
      name: "Dectra",
      alternateName: "Dectra AI Document Verification",
      description: "Verify Aadhaar XML, PAN, bank, and business documents with AI-powered cross-verification and fraud checks.",
      publisher: {
        "@id": "https://dectra.in/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://dectra.in/#organization",
      name: "Dectra",
      url: "https://dectra.in",
      logo: {
        "@type": "ImageObject",
        url: "https://dectra.in/Logo.png",
        width: 500,
        height: 500,
      },
    },
  ],
}

export default function Head() {
  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" href="/Logo.png" />
      <link rel="apple-touch-icon" href="/Logo.png" />
      <meta name="application-name" content="Dectra" />
      <meta name="apple-mobile-web-app-title" content="Dectra" />
      <meta name="format-detection" content="telephone=no" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
