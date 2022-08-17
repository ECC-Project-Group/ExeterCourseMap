import Link from 'next/link';
import React, { ReactChild, ReactFragment, ReactPortal, useCallback, useState } from 'react';
import { InferGetStaticPropsType } from "next";

const Submap = (props: { children: React.ReactNode; }) => {
  return (
    <li className="text-2xl pb-1 font-medium">
      {props.children}
    </li>
  );
};

const Maplink = ({ name, href }: { name: string, href: string }) => {
  return (
    <Link href={`maps/${href}`}>
      <a className='hover:bg-exeter hover:text-white'>{name}</a>
    </Link>
  )
}

const Maps = (props) => {

  return (
    <div>
      <div className="bg-exeter px-8 pt-24 pb-14 lg:px-40">
        <h1 className="font-display text-4xl font-black text-white md:text-5xl ">
          Maps
        </h1>
      </div>
      <div className="px-8 pt-8 pb-20 lg:px-40">
        <ul className="">
            <Submap>
                Arts:
                <ul className='pl-5'>
                    <Submap>
                        <Maplink name='Art' href='/art'/>
                    </Submap>
                    <Submap>
                        <Maplink name='Music' href='/music'/>
                    </Submap>
                    <Submap>
                        <Maplink name='Theater' href='/theater'/>
                    </Submap>
                </ul>
            </Submap>
            <Submap>
              <Maplink name='Classical Languages' href='/classics'/>
            </Submap>
            <Submap>
              <Maplink name='English' href='/english'/>
            </Submap>
            <Submap>
              <Maplink name='History' href='/history'/>
            </Submap>
            <Submap>
                Modern Languages:
                <ul className='pl-5'>
                    <Submap>
                        <Maplink name='Arabic' href='/arabic'/>
                    </Submap>
                    <Submap>
                        <Maplink name='Chinese' href='/chinese'/>
                    </Submap>
                    <Submap>
                        <Maplink name='French' href='/french'/>
                    </Submap>
                    <Submap>
                        <Maplink name='German' href='/german'/>
                    </Submap>
                    <Submap>
                        <Maplink name='Italian' href='/italian'/>
                    </Submap>
                    <Submap>
                        <Maplink name='Japanese' href='/japanese'/>
                    </Submap>
                    <Submap>
                        <Maplink name='Russian' href='/russian'/>
                    </Submap>
                    <Submap>
                        <Maplink name='Spanish' href='/spanish'/>
                    </Submap>
                </ul>
            </Submap>
            <Submap>
              <Maplink name='Religion' href='/religion'/>
            </Submap>
            <Submap>
              <Maplink name='STEM' href='/stem'/>
            </Submap>
        </ul>
      </div>
    </div>
  );
};

export default Maps;
