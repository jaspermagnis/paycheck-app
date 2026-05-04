import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonical,
  schema,
}) => {
  const siteName = 'Global Paycheck Calculator';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const metaTags = [
      { name: 'description', content: description },
      keywords && { name: 'keywords', content: keywords },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: siteName },
      ogImage && { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      ogImage && { name: 'twitter:image', content: ogImage },
    ].filter(Boolean);

    metaTags.forEach((tag: any) => {
      let element: HTMLMetaElement | null;
      if (tag.property) {
        element = document.querySelector(`meta[property="${tag.property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', tag.property);
          document.head.appendChild(element);
        }
      } else {
        element = document.querySelector(`meta[name="${tag.name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('name', tag.name);
          document.head.appendChild(element);
        }
      }
      element.content = tag.content;
    });

    // Update canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Add schema JSON-LD
    if (schema) {
      let script = document.getElementById('schema-jsonld') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'schema-jsonld';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    return () => {
      // Cleanup handled by next SEO component
    };
  }, [fullTitle, description, keywords, ogImage, ogType, canonical, schema]);

  return null;
};

export default SEO;
