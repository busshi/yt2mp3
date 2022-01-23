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


function Form( {filesList} ) {
	const [input, setInput] = useState({});
	const [conversionState, setConversionState] = useState('waiting');
	const [inputState, setInputState] = useState('waiting');

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInput( values => ({...values, [name]: value}));
		if (value.startsWith("https://www.youtube.com/watch?v=" || "https://m.youtube.com/watch?v="))
			setInputState('valid');
		else if (!value)
			setInputState('waiting');
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

//	var ClassName, msg, button;

	if (conversionState === 'waiting' && inputState === 'waiting') {
//		ClassName = 'wait';
//		msg = 'waiting for conversion...';
//		button = 'hide';}
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Paste yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
		  <p className={utilStyles.wait}>Waiting for conversion... </p>
	    </form>
	)}

	if (conversionState === 'waiting' && inputState === 'valid') {
	//	ClassName = 'none';
	//	msg = '';
	//	button = 'visible'; }
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Paste yt link here: </label>
	      <input className={utilStyles.valid_url} id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
	      <br/><br/><button className={utilStyles.button} type="submit">Convert</button>
	    </form>
	)}

	if (conversionState === 'waiting' && inputState === 'invalid') {
//		ClassName = 'error';
//		msg = 'Invalid URL';
//		button = 'hide';}
		var	filename = 'TEEST';
		return (
  	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Paste yt link here: </label>
	      <input className={utilStyles.invalid_url} id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
		  <p className={utilStyles.error}>Invalid URL</p>
			<a href='ok'>{filename}</a>
	    </form>
	)}

	if (conversionState === 'conversion error') {
//		ClassName = 'error';
//		msg = 'ERROR';
//		button = 'hide';}
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Paste yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
	      <button className={utilStyles.button} type="submit">Convert</button>
		<p className={utilStyles.error}>ERROR</p>
		<p>Conversion error or the link is already available</p>
	    </form>
	)}

	if (conversionState === 'converted')  {
//		ClassName = 'success';
//		msg = 'CONVERTED!';
//		button = 'visible';}
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Paste yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
	      <button className={utilStyles.button} type="submit">Convert</button>
		<p className={utilStyles.success}>CONVERTED!</p>
		<p>Reload to display the file...</p>
//			<a href={dlPath}>{filename}</a>
	    </form>
	)}

	if (conversionState === 'loading') {
//		ClassName = 'load';
//		msg = 'Loading... Please wait a few seconds... 1 minute is a maximum.';
//		button = 'hide';}
		return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Paste yt link here: </label>
	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
	      <button className={utilStyles.button} type="submit">Convert</button>
		<p className={utilStyles.load}>Loading... Please wait a few seconds... 1 minute is a maximum.</p>
	    </form>
	)}
//console.log(ClassName);
//	return (
//	    <form onSubmit={querySearch}>
//	      <label htmlFor="yt_link">Paste yt link here: </label>
//	      <input id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
//		  <p className={utilStyles.error}>{msg}</p>
//	      <button className={utilStyles.button} type="submit" display="none">Convert</button>
//	    </form>
//	)
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
