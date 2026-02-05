import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/content'
})

export default withNextra({
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './components/mdx-components.tsx'
    }
  }
})