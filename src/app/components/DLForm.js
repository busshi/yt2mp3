import { useState } from 'react';
import { BiReset } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import RotateLoader from "react-spinners/RotateLoader";

export default function DLForm( {actualList, setActualList, conversionState, setConversionState} ) {

	const [input, setInput] = useState({});
	const [dl_url, setURL] = useState();
	const [title, setTitle] = useState();
	const [quality, setQuality] = useState();
	const [inputState, setInputState] = useState('waiting');

	const qualityChange = (event) => {
		const value = event.target.value;
		setQuality(value.substring(0,3));
	}
	
	const handleChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setInput( values => ({...values, [name]: value}));
		if (value.startsWith("https://www.youtube.com/watch?v=") || value.startsWith("https://m.youtube.com/watch?v=") || value.startsWith("https://youtu.be/"))
			setInputState('valid');
		else if (!value)
			setInputState('waiting');
		else
			setInputState('invalid');
		setConversionState('waiting');
	}
	
	let p, msg, button = 'invisible', input_form, quality_btn = 'invisible', dl_link = 'invisible', dl_path, newname;

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
			newname = resTitle.title.replace(" (Audio)", "").replace(" (Audio)", "").replace(" (Official Audio)", "").replace(" (Clip Officiel)", "").replace(" (Clip officiel)", "").replace(" (Official Music Video)", "").replace(" (HD)", "").replace(" (HQ)", "").replace("HQ", "").replace(" (Son Officiel)", "").replace("Feat.", "ft.").replace("feat.", "ft.").replace("Ft.", "ft.");
			setURL("yt/" + newname + ".mp3");
			setTitle(newname);
			setConversionState(resTitle.state);
            dl_path = "yt/" + newname + ".mp3";
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
            setActualList([...actualList, {"id": newname, "dlPath": dl_path, "filename": newname, "thumbPath": "thumb/" + newname + '.jpeg'}]);
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
		dl_link = 'text-center flex justify-center text-2xl text-black dark:text-orange-500 hover:underline animate-pulse hover:animate-none pb-10 font-bold';
	}

	if (conversionState === 'loading') {
		p = 'text-white p-2 w-full md:max-w-[50%] border rounded-br-lg rounded-bl-lg ease-in duration-300';
		msg = 'Loading... Please wait a few seconds...';
		input_form = 'text-black bg-gray-500 w-full md:max-w-[50%] text-center pointer-events-none h-12';
	}

	return (
 
        <>
        <div className="p-5 flex justify-center">
		<FiSearch className="text-5xl pt-3" />
		</div>
	    <form className="text-center" onSubmit={querySearch}>
	        <label htmlFor="yt_link"></label>
		    <div className="flex justify-center">
 				<input
					 className={input_form} id="yt_link" name="yt_link" type="text" value={input.yt_link || ""} onChange={handleChange} placeholder="PASTE YT LINK HERE" required
 				/>
 		</div>
		<div className="flex justify-center">
		 	<p className={p}>{msg}</p>
		</div>

        {	(conversionState === 'loading' || conversionState === 'found') ? <div className="text-center p-10">
                                                            { (conversionState === 'found') ? <RotateLoader color="black" speedMultiplier="1"/> :
                                                                                                <RotateLoader color="red" speedMultiplier="3" />
                                                            }
                                                        </div> :
		            <select className={quality_btn} onChange={qualityChange} name="quality">
    				    <option>320 Kbps</option>
	    			    <option>256 Kbps</option>
		    		    <option>192 Kbps</option>
			      	    <option>128 Kbps</option>
		            </select>
        }
	      <br/>
		  <button className={button} type="submit">Convert</button><br/>
		</form>
		<a className={dl_link} href={dl_url}>{title}</a>
		{ (conversionState === 'converted' || conversionState === 'conversion error') ?
            <div className="grid justify-items-center">
                <a href="/">
                    <BiReset className="text-7xl animate-spin"/>
                </a>
            </div>
            :
            <></>
        }
		</>
	);
}