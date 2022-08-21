import { remark } from 'remark';
import html from 'remark-html';
import { Compatible } from 'vfile';

export default async function markdownToHtml(markdown: Compatible) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
