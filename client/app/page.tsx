'use client';

import { Route } from '@/@types/type';
import Header from '@/components/Header';
import Hero from '@/components/route/Hero';
import Heading from '@/utils/Heading';
import { useState } from 'react';

interface Props {}
const Page: React.FC<Props> = ({}) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState<Route>('Login');
  return (
    <div>
      <Heading
        title="E-Learning"
        description="E-Learning platform"
        keywords="Programming, MERN"
      />
      <Header
        activeItem={activeItem}
        open={open}
        setOpen={setOpen}
        route={route}
        setRoute={setRoute}
      />
      <Hero />
    </div>
  );
};

export default Page;
