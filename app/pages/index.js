import Head from 'next/head'
import { useState, useEffect } from "react";
import Layout, { siteTitle } from '../components/layout'
import { dirListing } from '../lib/dirListing'
import { FaPhotoVideo } from 'react-icons/fa';
import { MdSlowMotionVideo } from 'react-icons/md';
import { RiVideoDownloadLine } from 'react-icons/ri';
import { BiReset } from 'react-icons/bi';
import { AiOutlineFileSearch } from 'react-icons/ai';

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

function Form( {actualList, setActualList, conversionState, setConversionState} ) {

	const [input, setInput] = useState({});
	const [dl_url, setURL] = useState();
	const [title, setTitle] = useState();
	const [quality, setQuality] = useState();
	const [inputState, setInputState] = useState('waiting');

	const qualityChange = (event) => {
	//	const name = event.target.name;
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
			setActualList([]);
			for (let i = 0; i < resList.length; i++) {
				setActualList([...actualList, {"id":resList[i] , "dl_path": "yt/" + resList[i], "filename": resList[i], "thumbPath": "thumb/" + resList[i].replace('.mp3', '.jpeg')}])
			}	
		}
	}
	if (conversionState === 'found') {
		p = 'p-2 w-full md:max-w-[50%] text-white border rounded-br-lg rounded-bl-lg animate-pulse';
		msg = 'Found! Converting now...';
		input_form = 'text-center w-full md:max-w-[50%] bg-green-500 text-gray-500 pointer-events-none h-12';
	}

	if (conversionState === 'waiting' && inputState === 'waiting') {
		p = 'invisible ease-in duration-300';
		input_form = 'w-full md:max-w-[50%] text-center h-12';
	}

	if (conversionState === 'waiting' && inputState === 'valid') {
		p = 'invisible ease-in duration-300';
		button = 'text-xl text-white bg-red-500 rounded-xl w-1/3 hover:text-red-500 hover:bg-white hover:w-1/2 ease-out duration-200';
		input_form = 'bg-green-500 w-full md:max-w-[50%] text-center h-12';
		quality_btn = 'text-color-white bg-black m-10 px-5 border rounded';
	}

	if (conversionState === 'waiting' && inputState === 'invalid') {
		p = 'text-red-500 p-2 w-full md:max-w-[50%] border rounded-br-lg rounded-bl-lg ease-in duration-300';
		msg = 'Invalid URL';
		input_form = 'bg-red-500 w-full md:max-w-[50%] text-center h-12';
	}

	if (conversionState === 'conversion error') {
		p = 'text-red-500 p-2 w-full md:max-w-[50%] border rounded-br-lg rounded-bl-lg';
		msg = 'Conversion error';
		input_form = 'text-black w-full md:max-w-[50%] text-center h-12';
	}

	if (conversionState === 'converted')  {
		p = 'text-green-500 p-2 w-full md:max-w-[50%] border rounded-br-lg rounded-bl-lg';
		msg = 'CONVERTED!';
		input_form = 'text-black w-full md:max-w-[50%] text-center h-12';
		dl_link = 'text-2xl text-orange-500 light:text-black hover:underline animate-pulse hover:animate-none pb-10  font-bold';
	}

	if (conversionState === 'loading') {
		p = 'text-white p-2 w-full md:max-w-[50%] border rounded-br-lg rounded-bl-lg ease-in duration-300';
		msg = 'Loading... Please wait a few seconds...';
		input_form = 'text-black bg-gray-500 w-full md:max-w-[50%] text-center pointer-events-none h-12';
	}

	return (
		<div>
	    <form className="text-center p-5 grid justify-items-center" onSubmit={querySearch}>
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
		</form>
		<a className={dl_link} href={dl_url}>{title}</a>
		{ (conversionState === 'converted' || conversionState === 'conversion error') ? <div className="grid justify-items-center"><a href="/"><BiReset className="text-7xl animate-spin"/></a></div> : <></> }
	    </div>
	)
}

export default function Home({ filesList }) {

  const [actualList, setActualList] = useState(filesList);
  const [conversionState, setConversionState] = useState('waiting');
  
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="text-red-600 text-xl text-center p-5">
		  <div className="text-6xl p-5 grid grid-cols-3 justify-items-center">
		  { (conversionState === 'loading' || conversionState === 'found') ? 	<>
													  <div className="invisible md:visible"><FaPhotoVideo /></div>
													  <div className="animate-spin"><MdSlowMotionVideo /></div>
													  <div className="invisible md:visible "><RiVideoDownloadLine /></div>
												</> : <><div className="invisible md:visible hover:animate-ping"><FaPhotoVideo /></div>
													  <div className="hover:animate-spin"><MdSlowMotionVideo /></div>
													  <div className="invisible md:visible  hover:animate-ping"><RiVideoDownloadLine /></div>
												</> }
		</div>
	  </section>
	  <NoSsr>
	  <section>
		<Form actualList={actualList} setActualList={setActualList} conversionState={conversionState} setConversionState={setConversionState}/>
	  </section>
	  </NoSsr>
      <section>
		    <ul className="place-content-center place-items-stretch align-items-stretch grid md:grid-cols-2 lg:flex gap-10 text-center p-10">
          	{actualList.map(({ id, dlPath, filename, thumbPath }) => (
            	<li className="text-black hover:text-orange-500 justity-items-center p-5 bg-orange-500 border rounded-lg  border-white hover:border-orange-500 hover:bg-black transition transform hover:-translate-y-2 light:bg-white  light:border-orange-500 light:hover:border-white light:hover:bg-orange-500 light:hover:text-white" key={id}>
				<a className="hover:underline" href={dlPath}>
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