import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEOHead({
  title = 'JD GROUP Uganda - Quality Home Solutions',
  description = 'Discover quality furniture, electronics, and appliances at affordable prices. Powered by PEPKOR\'s excellence in retail.',
  image = '/og-image.jpg',
  url = 'https://jdgroup.ug',
  type = 'website'
}: SEOHeadProps) {
  const fullTitle = title === 'JD GROUP Uganda - Quality Home Solutions' 
    ? title 
    : `${title} | JD GROUP Uganda`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="JD GROUP Uganda" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="keywords" content="furniture, electronics, appliances, Uganda, PEPKOR, retail, home solutions" />
      <meta name="author" content="JD GROUP Uganda" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#FF5722" />

      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://uxolqtcieelehayczhpl.supabase.co" />
    </Helmet>
  );
}