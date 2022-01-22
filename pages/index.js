import Head from 'next/head'
import { useState } from "react";
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { dirListing } from '../lib/dirListing'
//import useSWR from 'swr';


//export async function getStaticProps() {
export async function getServerSideProps() {
  const filesList = dirListing()
  return {
    props: {
      filesList,
    },
//	revalidate: 120,
  }
}


//const fetcher = (...args) => fetch(...args).then((res) => res.json())

//function Progress() {
  //const { data, error } = useSWR('/api/search', fetcher);
  //if (!data) return <div>Converting...</div>
  //if (data.state == 'not valid') return <div>Failed to load URL</div>
  //if (data.state == 'converted') return <div>File converted... Reload the page...</div>

  //return ( <div></div> )
//}

function Form() {
	const [input, setInput, state] = useState({});

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInput( values => ({...values, [name]: value}))
	}

  	//const querySearch = async event => {
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
		return res.state;
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
	  </section>

      <section className={utilStyles.section}>
        <h3><br/>Available links:</h3>
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
