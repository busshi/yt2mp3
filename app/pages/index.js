import Head from 'next/head'
import { useState, useEffect } from "react";
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { dirListing } from '../lib/dirListing'

/*const NoSsr = ({ children }) => {
	const [mountedState, setMountedState] = useState(false);
	useEffect(() => {
		setMountedState(true);
	}, []);
	return <>{mountedState ? children : null}</>;
}*/

export async function getServerSideProps() {
  const filesList = dirListing()
  return {
    props: {
      filesList,
    },
  }
}

function Form( {actualList, setActualList} ) {

	const [input, setInput] = useState({});
	const [dl_url, setURL] = useState();
	const [title, setTitle] = useState();
	const [filename, setFilename] = useState();
	const [quality, setQuality] = useState();
	const [conversionState, setConversionState] = useState('waiting');
	const [inputState, setInputState] = useState('waiting');

	const qualityChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setQuality(value);
	}
	
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
	
	let p, msg, button, input_form, quality_btn, dl_link;

  	const querySearch = async event => {
		setConversionState('loading');
    	event.preventDefault();
		const link = input.yt_link;
		let quality_arg = quality;

		const reqTitle = await fetch('/api/filename', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({link})
		});

		let newname, dl_path, dl_filename;
		
		const resTitle = await reqTitle.json();
		if (resTitle.state === 'found') {
			newname = resTitle.title.replace(' (Clip Officiel)', '');
			newname = newname.replace(' (Clip officiel)', '');
			newname = newname.replace(' (HD)', '');
			setURL("yt/" + newname + ".mp3");
			dl_path = "yt/" + newname + ".mp3";
			dl_filename = newname + ".mp3";
			setFilename(newname + ".mp3");
			setTitle(newname);
			setConversionState(resTitle.state);
		}
	
		if (!quality_arg) {
			quality_arg = '320';
		}

		const req = await fetch('/api/search', {
    		method: 'POST',
    		headers: {
    		  'Content-Type': 'application/json'
    		},
    		redirect: 'follow',
    		referrerPolicy: 'no-referrer',
    		body: JSON.stringify({link: link, "quality": quality_arg})
  		});

		const res = await req.json();
		setConversionState(res.state);
		if (res.state === 'converted')
			setActualList([...actualList, {"id": newname, "dlPath": dl_path, "filename": newname}]);
	}

	if (conversionState === 'found') {
		p = 'load';
		msg = 'Found! Converting now...';
		button = 'hide';
		quality_btn = 'hide';
		input_form = 'valid_url';
		dl_link = 'hide';
	}

	if (conversionState === 'waiting' && inputState === 'waiting') {
		p = 'wait';
		msg = 'waiting for conversion...';
		button = 'hide';
		input_form = 'waiting_url';
		dl_link = 'hide';
		quality_btn = 'hide';
	}

	if (conversionState === 'waiting' && inputState === 'valid') {
		p = 'wait';
		msg = '';
		button = 'button';
		input_form = 'valid_url';
		dl_link = 'hide';
		quality_btn = 'quality_btn';
	}

	if (conversionState === 'waiting' && inputState === 'invalid') {
		p = 'error';
		msg = 'Invalid URL';
		button = 'hide';
		input_form = 'invalid_url';
		dl_link = 'hide';
		quality_btn = 'hide';
	}

	if (conversionState === 'conversion error') {
		p = 'error';
		msg = 'Conversion error';
		input_form = 'waiting_url';
		dl_link = 'hide';
		button = 'button';
		quality_btn = 'quality_btn';
	}

	if (conversionState === 'converted')  {
		p = 'success';
		msg = 'CONVERTED!';
		button = 'hide';
		quality_btn = 'hide';
		input_form = 'waiting_url';		
	}

	if (conversionState === 'loading') {
		p = 'load';
		msg = 'Loading... Please wait a few seconds...';
		button = 'hide';
		input_form = 'valid_url';
		dl_link = 'hide';
		quality_btn = 'hide';
	}

	return (
	    <form onSubmit={querySearch}>
	      <label htmlFor="yt_link"></label>
	      <input className={utilStyles[input_form]} id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} placeholder="PASTE YT LINK HERE" required/>
		  <p className={utilStyles[p]}>{msg}</p>
		  <p className={utilStyles[quality_btn]}> 
		  	<select className={utilStyles[quality_btn]} onChange={qualityChange} name="quality">
				<option>320</option>
				<option>256</option>
				<option>192</option>
			  	<option>128</option>
			  </select>
		 	Kbps</p>
	      <button className={utilStyles[button]} type="submit">Convert</button><br/><br/>
		  <a className={utilStyles[dl_link]} href={dl_url}>{title}</a>
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
        <h3><br/>Links available:</h3>
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