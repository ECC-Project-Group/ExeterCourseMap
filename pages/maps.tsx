import Link from 'next/link';
import React from 'react';

const Submap = (props: { children: React.ReactNode }) => {
  return <li className="pb-1 text-2xl font-medium">{props.children}</li>;
};

const Maplink = ({ name, href }: { name: string; href: string }) => {
  return (
    <Link href={`maps/${href}`}>
      <a className="hover:bg-exeter hover:text-white">{name}</a>
    </Link>
  );
};

const Maps = () => {
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
            <ul className="pl-5">
              <Submap>
                <Maplink name="Art" href="/art" />
              </Submap>
              <Submap>
                <Maplink name="Music" href="/music" />
              </Submap>
              <Submap>
                <Maplink name="Theater" href="/theater" />
              </Submap>
            </ul>
          </Submap>
          <Submap>
            <Maplink name="Classical Languages" href="/classics" />
          </Submap>
          <Submap>
            <Maplink name="English" href="/english" />
          </Submap>
          <Submap>
            <Maplink name="History" href="/history" />
          </Submap>
          <Submap>
            Modern Languages:
            <ul className="pl-5">
              <Submap>
                <Maplink name="Arabic" href="/arabic" />
              </Submap>
              <Submap>
                <Maplink name="Chinese" href="/chinese" />
              </Submap>
              <Submap>
                <Maplink name="French" href="/french" />
              </Submap>
              <Submap>
                <Maplink name="German" href="/german" />
              </Submap>
              <Submap>
                <Maplink name="Italian" href="/italian" />
              </Submap>
              <Submap>
                <Maplink name="Japanese" href="/japanese" />
              </Submap>
              <Submap>
                <Maplink name="Russian" href="/russian" />
              </Submap>
              <Submap>
                <Maplink name="Spanish" href="/spanish" />
              </Submap>
            </ul>
          </Submap>
          <Submap>
            <Maplink name="Religion" href="/religion" />
          </Submap>
          <Submap>
            STEM:
            <ul className="pl-5">
              <Submap>
                <Maplink name="Computer Science" href="/cs" />
              </Submap>
              <Submap>
                <Maplink name="Bio/Chem/Physics/Math" href="/stemwithoutcs" />
              </Submap>
              <Submap>
                <Maplink name="Physics/Math" href="/mathphysics" />
              </Submap>
              <Submap>
                <Maplink name="Math" href="/math" />
              </Submap>
            </ul>
          </Submap>
        </ul>
      </div>
    </div>
  );
};

export default Maps;
