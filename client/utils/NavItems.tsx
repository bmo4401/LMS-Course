import { cn } from '@/utils/utils';
import Link from 'next/link';

interface NavItemsProps {
  activeItem: number;
  isMobile: boolean;
}

export const navItemsData = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Courses',
    url: '/courses',
  },
  {
    name: 'Policy',
    url: '/policy',
  },
  {
    name: 'FAQ',
    url: '/faq',
  },
];
const NavItems: React.FC<NavItemsProps> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData.map((item, index) => (
          <Link
            href={`${item.url}`}
            key={item.url}
            passHref
          >
            <span
              className={cn(
                'text-[18px] px-6 font-Poppins font-[400]',
                activeItem === index
                  ? 'dark:text-[#37a39a] text-[crimson]'
                  : 'dark:text-white text-black',
              )}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link
              href="/"
              passHref
            >
              <span className="text-[12px] font-Poppins font-[500] text-black dark:text-white">
                E-Learning
              </span>
            </Link>
          </div>
          {navItemsData &&
            navItemsData.map((item, index) => (
              <Link
                href={'/'}
                passHref
              >
                <span
                  className={cn(
                    'block py-5 text-[18px] px-6 font-Poppins font-[400]',
                    activeItem === index
                      ? 'dark:text-[#37a39a] text-[crimson]'
                      : 'dark:text-white text-black',
                  )}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};
export default NavItems;
