import Head from 'next/head'
import Image from 'next/image'
import Footer from '../components/Footer';

const name = 'yt2mp3'
const logo = '/images/logo.png'
export const siteTitle = 'yt2mp3'

export default function Layout({ children, home }) {
  return (
    (home) ? 
    <div className="h-full min-w-[100%] text-white font-mono bg-gradient-to-b from-white via-gray-500 to-white dark:bg-gradient-to-b dark:from-black dark:via-gray-500 dark:to-black">
        <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
        <meta
          name="description"
          content="Download a mp3 from a youtube video"
        />
        </Head>
        
        <header className="text-5xl text-red-600 text-center pt-0 lg:pt-5">
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
      
        <main>
            {children}
        </main>

        <Footer />

    </div>
    :
    <div className="h-screen min-w-[100%] text-white font-mono bg-gradient-to-b from-white via-gray-500 to-white dark:bg-gradient-to-b dark:from-black dark:via-gray-500 dark:to-black">
        {children}
    </div>
    )
}