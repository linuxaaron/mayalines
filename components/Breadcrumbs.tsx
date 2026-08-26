import StructuredData from "./StructuredData";

type Breadcrumb = { name: string; url: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quotes-git-main-aaron-727f.vercel.app";

function absoluteUrl(url: string) {
  return new URL(url, siteUrl).toString();
}

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };

  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <span key={item.url}>
            {index > 0 && <span aria-hidden="true"> / </span>}
            {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <a href={item.url}>{item.name}</a>}
          </span>
        ))}
      </nav>
      <StructuredData data={data} />
    </>
  );
}
