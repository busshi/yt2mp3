import Head from 'next/head'
import { useState } from "react";
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { dirListing } from '../lib/dirListing'
//import { checkProgress } from '../lib/checkProgress'

export async function getStaticProps() {
  const filesList = dirListing()
//  const progress = checkProgress()
  return {
    props: {
      filesList,
//	  progress
    }
  }
}

function Progress() {
	return (<p></p>);
//	if (state == 'in progress')
//		return (<p>VALID</p>);
//	else
//		return (<p>TEST</p>);
}

function Form() {
	const [input, setInput, state] = useState({});

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInput( values => ({...values, [name]: value}))
	}

  	const querySearch = async event => {
    	event.preventDefault();
		const link = input.yt_link;
		const req = await fetch('/api/search', {
    		method: 'POST',
    		mode: 'cors',
    		cache: 'no-cache',
    		credentials: 'same-origin',
    		headers: {
    		  'Content-Type': 'application/json'
    		},
    		redirect: 'follow',
    		referrerPolicy: 'no-referrer',
    		body: JSON.stringify({link})
  		});
		const res = await req.json();
		console.log(res);
		state = res.state;
	}
  	return (
      <form onSubmit={querySearch}>
      <label htmlFor="yt_link">Past yt link here: </label>
      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
      <button className={utilStyles.button} type="submit">Convert</button>
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

	  <section className={utilStyles.section}>
		<Form />
		<Progress />
	  </section>

      <section className={utilStyles.section}>
        <h3><br/>Previous links:</h3>
        <ul className={utilStyles.link}>
          {filesList.map(({ id, dlPath, filename }) => (
            <li className={utilStyles.link} key={id}>
			<a href={dlPath}>{filename}</a>
            </li>
          ))}
        </ul>
      </section>

    </Layout>
  )
}
