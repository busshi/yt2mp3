import Head from 'next/head'
import Image from 'next/image'

const name = 'yt2mp3'
const logo = '/images/logo.png'
export const siteTitle = 'yt2mp3'

export default function Layout({ children }) {
  return (
    <div className="text-white font-mono bg-gradient-to-b from-black via-gray-500 to-black light:bg-gradient-to-b light:from-white light:via-gray-500 light:to-white">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
        <meta
          name="description"
          content="Download a mp3 from a youtube video"
        />
      </Head>
      <header className="text-3xl text-red-600 pt-10 text-center">
          <>
            <h1 className="font-bold">{name}</h1>
            <Image
              priority
              src={logo}
              className="h-50 hover:animate-pulse"
              height={200}
              width={200}
              alt={name}
            />
          </>
      </header>
      <main>{children}</main>
   
      <footer className="text-gray-500 text-center p-5">
      <hr className="p-2 self-stretch border-gray-600 border-1" />
        <a className="hover:animate-pulse" href="/" rel="noopener noreferrer">
          Powered by busshi
        </a>
      </footer>
    </div>
  )
}
