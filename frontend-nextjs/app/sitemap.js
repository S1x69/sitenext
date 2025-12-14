// Redirecionar para sitemap_index.xml
import { redirect } from 'next/navigation';

export default async function sitemap() {
  redirect('/sitemap_index.xml');
}
