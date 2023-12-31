import Image from 'next/image';
import Link from 'next/link';
import { BiSearch } from 'react-icons/bi';

const Hero = () => {
  return (
    <div className="w-full 1000px:flex items-center gap-20">
      <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-0 z-10 relative">
        <Image
          src={require('../../public/assets/bmw_none.png')}
          alt=""
          className="object-cover 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-auto z-10 rounded-full bg-transparent"
        />
        <div className="absolute top-0 left-12 1000px:top-[unset] 1500px:h-[700px] 1100px:h-[600px] h-[50vh] 1500px:w-[700px] 1100px:w-[600px] w-[50vh]  hero-animation rounded-full" />
      </div>
      <div className="1000px:w-[60%] flex flex-col items-start 1000px:mt-0 text-center 1000px:text-left mt-[150px] ">
        <h2 className="dark:text-white text-[#000000c7] text-[30px]  w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[90%]">
          Improve Your Online Learning Experience Better Instantly
        </h2>
        <br />
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[70%]">
          We have 40k+ Online course & 50k+ Online Registered student. Find your
          desired Course from them.
        </p>
        <br />
        <br />
        <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px]  bg-transparent relative">
          <input
            type="search"
            placeholder="Search Courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch
              className="text-white"
              size={30}
            />
          </div>
        </div>
        <br />
        <br />
        <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center">
          <Image
            src={require('../../public/assets/spotify_none.png')}
            alt=""
            className="rounded-full w-10 h-10"
          />
          <Image
            src={require('../../public/assets/nasa_none.png')}
            alt=""
            className="rounded-full w-10 h-10"
          />{' '}
          <Image
            src={require('../../public/assets/redbulk_none.png')}
            alt=""
            className="rounded-full w-10 h-10"
          />
          <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
            500K+ People already trusted us.{' '}
            <Link
              href="/courses"
              className="dark:text-[#46e256] text-[crimson]"
            >
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Hero;
