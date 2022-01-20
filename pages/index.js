import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { dirListing } from '../lib/dirListing'

export async function getStaticProps() {
  const filesList = dirListing()
  return {
    props: {
      filesList
    }
  }
}

function Form() {
  const querySearch = async event => {
    event.preventDefault()

    const res = await fetch(
      //'https://www.youtube.com/results?search_query=SEARCH/',
      'http://192.168.1.150:9898/json.htm?type=command&param=getversion',
      {
        body: JSON.stringify({
          name: event.target.name.value
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

  //  const result = await res.json()
//	console.log(result);
  }

  return (
    <form onChange={querySearch}>
      <label htmlFor="yt_dl">Paste yt link here: </label>
      <input id="yt_dl" name="yt_dl" type="text" autoComplete="yt_dl" required />
      <button type="submit">Convert</button>
    </form>
  )
}

export default function Home({ filesList }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.title}>
        <p>Welcome to yt2mp3 Downloader</p>
	  </section>

	  <section>
		<Form />
	  </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h3 className={utilStyles.headingLg}>Results:</h3>
        <ul className={utilStyles.list}>
          {filesList.map(({ id, filename }) => (
            <li className={utilStyles.listItem} key={id}>
			{filename}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
