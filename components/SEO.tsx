
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

const SEO: React.FC<SEOProps> = ({
  title = "Recap Chat — Pahami Percakapanmu",
  description = "Recap Chat membantu kamu membaca ulang percakapan WhatsApp dengan rapi, jelas, dan mendalam. Upload file chat, lihat rangkuman topik, timeline, emosi, dan pola komunikasi.",
  keywords = "Recap Chat, analisis chat whatsapp, curhat anonim, chat summary, sentiment analysis, mood meter",
  image = "/favicon.png",
  url = "https://recapchat.xyz",
  type = "website",
  canonical = "https://recapchat.xyz",
  twitterCard = "summary_large_image",
}) => {
  const fullTitle = title.includes("Recap Chat") ? title : `${title} | Recap Chat`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Recap Chat" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Google Verification */}
      {/* Replace with actual verification code if provided later */}
      <meta name="google-site-verification" content="G-XXXXXXXXXX" />
    </Helmet>
  );
};

export default SEO;
