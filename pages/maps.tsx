import Image from 'next/image';
import Link from 'next/link';

const MapLink = ({
  name,
  href,
  imageSrc,
}: {
  name: string;
  href: string;
  imageSrc: string;
}) => {
  return (
    <Link href={`maps/${href}`}>
      <a>
        <div className="group relative flex h-24 flex-col items-center justify-center overflow-hidden rounded-md outline outline-1 outline-neutral-300 drop-shadow-xl">
          <Image
            src={imageSrc}
            alt={`Thumbnail for ${name}`}
            layout="fill"
            className="rounded-md object-cover saturate-0 transition-all ease-out group-hover:scale-105 group-hover:saturate-100"
          />
          <div className="absolute top-0 bottom-0 left-0 right-0 rounded-md bg-black opacity-70 transition-all ease-out group-hover:bg-exeter"></div>
          <h1 className="absolute text-center font-display text-2xl font-bold text-white drop-shadow-2xl">
            {name}
          </h1>
        </div>
      </a>
    </Link>
  );
};

const Maps = () => {
  return (
    <div>
      <div className="bg-exeter px-8 py-16 lg:px-40">
        <h1 className="font-display text-4xl font-black text-white md:text-5xl ">
          Maps
        </h1>
      </div>
      <div className="absolute -left-[300px] -z-20 -mt-12 rotate-1 opacity-20">
        <Image alt="Decal" src="/decal2.svg" width={2000} height={1000} />
      </div>
      <div className="grid grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:py-20 lg:px-40">
        <MapLink name="Art" href="art" imageSrc="/map-thumbnails/art.webp" />
        <MapLink
          name="Music"
          href="music"
          imageSrc="/map-thumbnails/music.webp"
        />
        <MapLink
          name="Theater"
          href="theater"
          imageSrc="/map-thumbnails/theater.webp"
        />
        <MapLink
          name="Classical Languages"
          href="classics"
          imageSrc="/map-thumbnails/classics.png"
        />
        <MapLink
          name="English"
          href="english"
          imageSrc="/map-thumbnails/english.jpg"
        />
        <MapLink
          name="History"
          href="history"
          imageSrc="/map-thumbnails/history.png"
        />
        <MapLink
          name="Arabic"
          href="arabic"
          imageSrc="/map-thumbnails/arabic.webp"
        />
        <MapLink
          name="Chinese"
          href="chinese"
          imageSrc="/map-thumbnails/chinese.jpg"
        />
        <MapLink
          name="French"
          href="french"
          imageSrc="/map-thumbnails/french.jpg"
        />
        <MapLink
          name="German"
          href="german"
          imageSrc="/map-thumbnails/german.jpg"
        />
        <MapLink
          name="Italian"
          href="italian"
          imageSrc="/map-thumbnails/italian.webp"
        />
        <MapLink
          name="Japanese"
          href="japanese"
          imageSrc="/map-thumbnails/japanese.jpg"
        />
        <MapLink
          name="Russian"
          href="russian"
          imageSrc="/map-thumbnails/russian.jpg"
        />
        <MapLink
          name="Spanish"
          href="spanish"
          imageSrc="/map-thumbnails/spanish.jpg"
        />
        <MapLink
          name="Religion"
          href="religion"
          imageSrc="/map-thumbnails/religion.jpg"
        />
        <MapLink name="Math" href="math" imageSrc="/map-thumbnails/math.jpg" />
        <MapLink
          name="Computer Science"
          href="cs"
          imageSrc="/map-thumbnails/cs.jpg"
        />
        <MapLink
          name="Bio / Chem / Physics / Math"
          href="stemwithoutcs"
          imageSrc="/map-thumbnails/science.webp"
        />
        <MapLink
          name="Physics / Math"
          href="mathphysics"
          imageSrc="/map-thumbnails/physicsmath.png"
        />
      </div>
    </div>
  );
};

export default Maps;
