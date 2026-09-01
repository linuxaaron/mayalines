type JsonLdProps = { data: Record<string, unknown>; nonce?: string };

export default function StructuredData({ data, nonce }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
