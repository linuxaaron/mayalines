export const quoteTopics = [
  { slug: "love", label: "Love", description: "Famous quotes about love, relationships and affection." },
  { slug: "life", label: "Life", description: "Timeless quotes about life, living and what matters." },
  { slug: "wisdom", label: "Wisdom", description: "Wisdom quotes about knowledge, judgment and experience." },
  { slug: "success", label: "Success", description: "Quotes about success, ambition, achievement and progress." },
  { slug: "motivation", label: "Motivation", description: "Motivational quotes for focus, discipline and action." },
  { slug: "inspiration", label: "Inspiration", description: "Inspirational words to encourage new ideas and perspective." },
  { slug: "happiness", label: "Happiness", description: "Quotes about happiness, joy, gratitude and contentment." },
  { slug: "courage", label: "Courage", description: "Quotes about courage, bravery, resilience and fear." },
  { slug: "friendship", label: "Friendship", description: "Quotes about friendship, loyalty and human connection." },
  { slug: "freedom", label: "Freedom", description: "Quotes about freedom, independence and liberty." },
  { slug: "philosophy", label: "Philosophy", description: "Philosophical quotes about existence, truth and meaning." },
  { slug: "truth", label: "Truth", description: "Quotes about truth, honesty and seeing things clearly." },
] as const;

export function topicForQuote(quote: { quote: string; category: string }) {
  const text = `${quote.quote} ${quote.category}`.toLowerCase();
  const topics = new Set<string>();
  if (/(love|heart|affection|romance|beloved|friendship)/.test(text)) topics.add("love");
  if (/(life|live|living|death|existence)/.test(text)) topics.add("life");
  if (/(wisdom|wise|knowledge|learn|experience)/.test(text)) topics.add("wisdom");
  if (/(success|achieve|achievement|ambition|victory|progress)/.test(text)) topics.add("success");
  if (/(motivat|discipline|effort|action|work|persist|determination)/.test(text)) topics.add("motivation");
  if (/(inspir|dream|possibil|creative|imagination)/.test(text)) topics.add("inspiration");
  if (/(happ|joy|gratitude|content|smile)/.test(text)) topics.add("happiness");
  if (/(courage|brave|fear|strength|resilien|bold)/.test(text)) topics.add("courage");
  if (/(friend|compan|loyal)/.test(text)) topics.add("friendship");
  if (/(freedom|free|liberty|independent)/.test(text)) topics.add("freedom");
  if (/(philosoph|meaning|existence|reality|being|truth)/.test(text)) topics.add("philosophy");
  if (/(truth|honest|honesty|real|false|lie)/.test(text)) topics.add("truth");
  if (!topics.size) topics.add(quote.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  return [...topics];
}
