import Head from 'next/head'
import { useState } from "react";
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { dirListing } from '../lib/dirListing'

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


function Form() {
	const [input, setInput] = useState({});
	const [conversionState, setConversionState] = useState('waiting');
	const [inputState, setInputState] = useState('waiting');

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInput( values => ({...values, [name]: value}));
		if (value.startsWith("https://www.youtube.com/watch?v="))
			setInputState('valid');
		else
			setInputState('invalid');
		setConversionState('waiting');
	}

  	const querySearch = async event => {
		setConversionState('loading');
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
		setConversionState(res.state);
	}

	if (conversionState === 'waiting' && inputState === 'waiting') {
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Past yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
		  <p className={utilStyles.wait}>Waiting for conversion... </p>
	    </form>
	)}

	if (conversionState === 'waiting' && inputState === 'valid') {
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Past yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
	      <br/><br/><button className={utilStyles.button} type="submit">Convert</button>
	    </form>
	)}

	if (conversionState === 'waiting' && inputState === 'invalid') {
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Past yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
		  <p className={utilStyles.error}>Invalid URL</p>
	    </form>
	)}

	if (conversionState === 'conversion error') {
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Past yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
	      <button className={utilStyles.button} type="submit">Convert</button>
		<p className={utilStyles.error}>ERROR</p>
		<p>Conversion error or the link is already available</p>
	    </form>
	)}

	if (conversionState === 'converted') {
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Past yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
	      <button className={utilStyles.button} type="submit">Convert</button>
		<p className={utilStyles.success}>CONVERTED!</p>
		<p>🔽 You can download the file(s) below 🔽</p>
	    </form>
	)}

	if (conversionState === 'loading') {
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Past yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
	      <button className={utilStyles.button} type="submit">Convert</button>
		<p className={utilStyles.load}>Loading... Please wait a few seconds... 1 minute is a maximum.</p>
	    </form>
	)}
}


export default function Home({ filesList }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.title}>
        <h2>Welcome to yt2mp3 Downloader<br/><br/></h2>
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
