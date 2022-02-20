import Head from 'next/head'

export const SEO = () => {
  const pageTitle = 'Community Statement on “NFT art”'
  const pageDescription = 'The website for a community statement on “NFT art” signed by “NFT artists“ who want to show their commitment to ensuring the continued development of the “NFT art” movement.'
  const defaultUrl = 'http://nft-art-statement.github.io/'
  const imgUrl = `${defaultUrl}ogp.png`
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="description" content={pageDescription} />
        <meta property="og:url" content={defaultUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:site_name" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={imgUrl} />
      </Head>
    </>
  )
}