import { generateStaticParamsFor, importPage } from 'nextra/pages'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: { params: Promise<{ mdxPath?: string[] }> }) {
  const { mdxPath } = await props.params
  if (!mdxPath) return { title: 'Page Not Found' } // fallback
  const { metadata } = await importPage(['docs', ...mdxPath])
  return metadata
}

export default async function Page(props: { params: Promise<{ mdxPath?: string[] }> }) {
  const { mdxPath } = await props.params

  if (!mdxPath) return <div>MDX page not found</div>

  console.log('PARAMS:', mdxPath)

  const { default: MDXContent, toc, metadata } = await importPage(['docs', ...mdxPath])
  return <MDXContent {...props} params={{ mdxPath }} toc={toc} metadata={metadata} />
}
