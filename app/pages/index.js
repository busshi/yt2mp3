import Head from 'next/head'
import { useState, useEffect } from "react";
import Layout, { siteTitle } from '../components/layout'
import { dirListing } from '../lib/dirListing'


const NoSsr = ({ children }) => {
	const [mountedState, setMountedState] = useState(false);
	useEffect(() => {
		setMountedState(true);
	}, []);
	return <>{mountedState ? children : null}</>;
}

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
	const [quality, setQuality] = useState();
	const [conversionState, setConversionState] = useState('waiting');
	const [inputState, setInputState] = useState('waiting');

	const qualityChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setQuality(value.substring(0,3));
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
	
	let p, msg, button = 'invisible', input_form, quality_btn = 'invisible', dl_link = 'invisible';

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

		const resTitle = await reqTitle.json();
		if (resTitle.state === 'found') {
			let newname = resTitle.title.replace(' (Clip Officiel)', '').replace(' (Clip officiel)', '').replace(' (HD)', '');
			setURL("yt/" + newname + ".mp3");
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
		if (res.state === 'converted') {
			const reqList = await fetch('/api/list', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const resList = await reqList.json();
			setActualList([])
			for (let i = 0; i < resList.length; i++) {
				setActualList([...actualList, {"id":resList[i] , "dl_path": "yt/" + resList[i], "filename": resList[i], "thumbPath": "thumb/" + resList[i].replace('.mp3', '.jpeg')}])
			}	
		}
	}
	if (conversionState === 'found') {
		p = 'p-5 text-white animate-pulse';
		msg = 'Found! Converting now...';
		input_form = 'text-center w-full md:max-w-[50%] bg-green-500 text-gray-500 pointer-events-none';
	}

	if (conversionState === 'waiting' && inputState === 'waiting') {
		p = 'p-5 text-white';
		msg = 'waiting for conversion...';
		input_form = 'w-full md:max-w-[50%] text-center';
	}

	if (conversionState === 'waiting' && inputState === 'valid') {
		p = 'invisible';
		button = 'text-xl text-white bg-red-500 rounded-xl w-1/3 hover:text-red-500 hover:bg-white hover:w-1/2 ease-out duration-200';
		input_form = 'bg-green-500 w-full md:max-w-[50%] text-center';
		quality_btn = 'text-color-white bg-black m-10 px-5 border rounded';
	}

	if (conversionState === 'waiting' && inputState === 'invalid') {
		p = 'p-5 text-red-500';
		msg = 'Invalid URL';
		input_form = 'bg-red-500 w-full md:max-w-[50%] text-center';
	}

	if (conversionState === 'conversion error') {
		p = 'p-5 text-red-500 text-2xl';
		msg = 'Conversion error';
		input_form = 'text-black w-full md:max-w-[50%] text-center';
	}

	if (conversionState === 'converted')  {
		p = 'p-5 text-green-500 text-2xl';
		msg = 'CONVERTED!';
		input_form = 'text-black w-full md:max-w-[50%] text-center h-12';
		dl_link = 'text-2xl text-orange-300 hover:underline animate-pulse hover:animate-none';
	}

	if (conversionState === 'loading') {
		p = 'p-5 text-white';
		msg = 'Loading... Please wait a few seconds...';
		input_form = 'text-black bg-gray-500 w-full md:max-w-[50%] text-center pointer-events-none';
	}

	return (
		<>
	    <form className="text-center justify-center p-5" onSubmit={querySearch}>
	      <label htmlFor="yt_link"></label>
	      <input className={input_form} id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} placeholder="PASTE YT LINK HERE" required/>
		  <p className={p}>{msg}</p>
		  <select className={quality_btn} onChange={qualityChange} name="quality">
				<option>320 Kbps</option>
				<option>256 Kbps</option>
				<option>192 Kbps</option>
			  	<option>128 Kbps</option>
		  </select>
	      <br/>
		  <button className={button} type="submit">Convert</button><br/>
		  <a className={dl_link} href={dl_url}>{title}</a>
		  { (conversionState === 'converted') ? <div className="p-10 underline text-gray-500"><a href="/">Reset</a></div> : <></> }
	    </form>
		</>
	)
}

export default function Home({ filesList }) {

  const [actualList, setActualList] = useState(filesList);
  
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="text-red-600 text-xl text-center p-10">
        <h2>Welcome to yt2mp3 Downloader</h2>
	  </section>
	  <NoSsr>
	  <section>
		<Form actualList={actualList} setActualList={setActualList}/>
	  </section>
	  </NoSsr>
      <section>
	    <hr className="p-2 self-stretch border-gray-600 border-1" />
     	<h3 className="text-orange-500 p-5 text-center text-xl">LINKS AVAILABLE:</h3>
        	<ul className="place-content-center place-items-stretch grid md:grid-cols-2 lg:flex gap-5 text-center p-10">
          	{actualList.map(({ id, dlPath, filename, thumbPath }) => (
            	<li className="justity-items-center p-5 border rounded-lg  border-orange-500 hover:border-black hover:bg-orange-500" key={id}>
				<a className="text-orange-500 hover:text-black hover:animate-pulse hover:underline" href={dlPath}>
					<img className="justify-content-center" src={thumbPath} height="100%" width="100%"/>
					<p className="pt-5">{filename}</p>
				</a>
				</li>
          	))}
        	</ul>
      </section>

    </Layout>
  )
}