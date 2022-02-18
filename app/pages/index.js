import { useState } from 'react';
//import { userService } from 'services';
import { dirListing } from '../lib/dirListing'
import { FaPhotoVideo } from 'react-icons/fa';
import { MdSlowMotionVideo } from 'react-icons/md';
import { RiVideoDownloadLine } from 'react-icons/ri';
import DLForm from '../components/DLForm';
import NoSSR from '../components/NoSSR';
import Layout from '../components/layout';

export async function getServerSideProps() {
  const filesList = dirListing()
  return {
    props: {
      filesList,
    },
  }
}

export default function Home({ filesList }) {
//    const [users, setUsers] = useState(null);
	const [actualList, setActualList] = useState(filesList);
	const [conversionState, setConversionState] = useState('waiting');

  //  useEffect(() => {
    //    userService.getAll().then(x => setUsers(x));
    //}, []);

    return (
		<Layout home>
		
			<section className="text-red-600 text-xl text-center">
				<div className="text-6xl p-5 grid grid-cols-3 justify-items-center">
				{ (conversionState === 'loading' || conversionState === 'found') ? 	<>
														<div className="invisible md:visible hover:animate-ping"><FaPhotoVideo /></div>
														<div className="hover:animate-spin"><MdSlowMotionVideo /></div>
														<div className="invisible md:visible hover:animate-ping"><RiVideoDownloadLine /></div>
												  </> : <><div className="invisible md:visible hover:animate-ping"><FaPhotoVideo /></div>
														<div className="hover:animate-spin"><MdSlowMotionVideo /></div>
														<div className="invisible md:visible hover:animate-ping"><RiVideoDownloadLine /></div>
												  </> }
		  		</div>
			</section>

			<NoSSR>
				<section>
				  	<DLForm actualList={actualList} setActualList={setActualList} conversionState={conversionState} setConversionState={setConversionState}/> 
				</section>
			</NoSSR>
		
			<section>
				<ul className="place-items-stretch grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-10 text-center p-10">
					{actualList.map(({ id, dlPath, filename, thumbPath }) => (
				  		<li className="text-black justity-items-center p-5 bg-gray-300 border border-orange-500 rounded-lg  hover:border-white hover:bg-orange-500 hover:text-white dark:bg-orange-500  dark:hover:text-orange-500 dark:border-white dark:hover:bg-black transition transform hover:-translate-y-2" key={id}>
				  			<a className="hover:underline" href={dlPath}>
					  			<img className="justify-content-center" src={thumbPath} height="100%" width="100%"/>
					  			<p className="pt-5 place-content-evenly">{filename}</p>
				  			</a>
				  		</li>
					))}
			  	</ul>
			</section>

		</Layout>
	);
}
