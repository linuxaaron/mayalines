import Link from "next/link";
import { quoteCollections } from "./quote-collections";
export default function CollectionLinks(){return <div className="collection-links">{quoteCollections.map(c=><Link href={`/collections/${c.slug}`} key={c.slug}>{c.title}</Link>)}</div>}
