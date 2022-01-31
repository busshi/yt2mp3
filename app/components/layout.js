import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const name = 'yt2mp3'
const logo = '/images/logo.png'
export const siteTitle = 'yt2mp3'

export default function Layout({ children, home }) {
  return (
    <div className="text-white bg-gradient-to-b from-black via-gray-500 to-black dark:text-black dark:bg-white">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
        <meta
          name="description"
          content="Download a mp3 from a youtube video"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
      </Head>
      <header className="text-3xl text-red-600 pt-10 text-center">
        {home ? (
          <>
            <h1>{name}</h1>
            <Image
              priority
              src={logo}
              className="h-50 hover:animate-pulse"
              height={200}
              width={200}
              alt={name}
            />
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Image
                  priority
                  src={logo}
                  className="h-50 hover:animate-pulse"
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </Link>
            <h2>
              <Link href="/">
                <a>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
      <footer className="text-gray-500 text-center p-5">
      <hr className="p-2 self-stretch border-gray-600 border-1" />
        <a className="hover:animate-pulse" href="/" rel="noopener noreferrer">
          Powered by busshi
        </a>
      </footer>
    </div>
  )
}
