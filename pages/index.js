import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

function Form() {
  const querySearch = async event => {
    event.preventDefault()

    const res = await fetch(
      'https://www.youtube.com/results?search_query=SEARCH',
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

    const result = await res.json()
  }

  return (
    <form onChange={querySearch}>
      <label htmlFor="yt_search">Search on YouTube: </label>
      <input id="yt search" name="yt_search" type="text" autoComplete="yt_search" required />
      <button type="submit">Search</button>
    </form>
  )
}

export default function Home({ allPostsData }) {
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
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
