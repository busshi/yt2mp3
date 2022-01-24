import Head from 'next/head'
import { useState } from "react";
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { dirListing } from '../lib/dirListing'

export async function getServerSideProps() {
  const filesList = dirListing()
  return {
    props: {
      filesList,
    },
  }
}


function Form( {actualList, setActualList}) {
	const [input, setInput] = useState({});
	const [dl_url, setURL] = useState();
	const [conversionState, setConversionState] = useState('waiting');
	const [inputState, setInputState] = useState('waiting');

	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInput( values => ({...values, [name]: value}));
		if (value.startsWith("https://www.youtube.com/watch?v=") || value.startsWith("https://m.youtube.com/watch?v="))
			setInputState('valid');
		else if (!value)
			setInputState('waiting');
		else
			setInputState('invalid');
		setConversionState('waiting');
	}
	
	let p, msg, button, input_form, dl_link;

  	const querySearch = async event => {
		setConversionState('loading');
    	event.preventDefault();
		const link = input.yt_link;

		const reqTitle = await fetch('/api/filename', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({link})
		});
		const resTitle = await reqTitle.json();

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

		if (res.state === 'converted') {
			setURL("yt/" + resTitle.title + ".mp3");
			setActualList([...actualList, {"id": resTitle.title, "dlPath": "yt/" + resTitle.title + ".mp3", "filename": "Latest converted file"}]);
		}
	}

	if (conversionState === 'waiting' && inputState === 'waiting') {
		p = 'wait';
		msg = 'waiting for conversion...';
		button = 'hide';
		dl_link = 'hide';}

	if (conversionState === 'waiting' && inputState === 'valid') {
		p = 'wait';
		msg = '';
		button = 'button';
		input_form = 'valid_url';
		dl_link = 'hide';}

	if (conversionState === 'waiting' && inputState === 'invalid') {
		p = 'error';
		msg = 'Invalid URL';
		button = 'hide';
		input_form = 'invalid_url';
		dl_link = 'hide';}

	if (conversionState === 'conversion error') {
		p = 'error';
		msg = 'Conversion error';
		button = 'hide';
		dl_link = 'hide';}

	if (conversionState === 'converted')  {
		p = 'success';
		msg = 'CONVERTED!';}

	if (conversionState === 'loading') {
		p = 'load';
		msg = 'Loading... Please wait a few seconds... 1 minute is a maximum.';
		button = 'hide';
		input_form = 'valid_url';
		dl_link = 'hide';}

	return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link">Paste yt link here: </label>
	      <input className={utilStyles[input_form]} id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} required/>
		  <p className={utilStyles[p]}>{msg}</p>
	      <button className={utilStyles[button]} type="submit">Convert</button><br/><br/>
		  <a className={utilStyles[dl_link]} href={dl_url}>DOWNLOAD HERE</a>
	    </form>
	)
}


export default function Home({ filesList }) {
  const [actualList, setActualList] = useState(filesList);
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.title}>
        <h2>Welcome to yt2mp3 Downloader<br/><br/></h2>
	  </section>

	  <section className={utilStyles.section}>
		<Form actualList={actualList} setActualList={setActualList}/>
	  </section>

      <section className={utilStyles.section}>
        <h3><br/>Links still available:</h3>
        <ul className={utilStyles.link}>
          {actualList.map(({ id, dlPath, filename }) => (
            <li className={utilStyles.link} key={id}>
			<a href={dlPath}>{filename}</a>
            </li>
          ))}
        </ul>
      </section>

    </Layout>
  )
}
