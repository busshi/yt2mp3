import Head from 'next/head'
import { useState } from "react";
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
	const [input, setInput] = useState({});

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInput( values => ({...values, [name]: value}))
	}

  	const querySearch = async event => {
    	event.preventDefault();
		const link = input.yt_link
		const req = await fetch(`/api/search?link=${link}`)
		const res = await req.json()
		console.log(res);
		const state = res.state;
	}
	//console.log(state);

  	return (
      <form onSubmit={querySearch}>
      <label htmlFor="yt_link">Paste yt link here: </label>
      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
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
        <h2>Welcome to yt2mp3 Downloader</h2>
	  </section>

	  <section>
		<Form />
	  </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h3 className={utilStyles.headingLg}>Previous links still available:</h3>
        <ul className={utilStyles.list}>
          {filesList.map(({ id, dlPath, filename }) => (
            <li className={utilStyles.listItem} key={id}>
			<a href={dlPath}>{filename}</a>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
