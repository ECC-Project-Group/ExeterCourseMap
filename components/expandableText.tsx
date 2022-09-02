import { useState } from 'react';

const ExpandableText = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => {
  const [showingMore, setShowingMore] = useState(false);

  return (
    <div className="relative">
      <p
        className={`${className} pointer-events-none max-h-[10rem] select-none opacity-0 transition-all ease-out md:max-h-full ${
          showingMore ? 'max-h-full' : ''
        }`}
      >
        {text}
      </p>
      <div className="absolute top-0 h-full w-full">
        <div
          className="relative top-0 overflow-hidden transition-all ease-out"
          style={{
            maxHeight: showingMore ? '100%' : '10rem',
          }}
        >
          <div
            className="absolute left-0 right-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-white dark:to-neutral-700"
            style={{
              display: showingMore ? 'none' : 'block',
            }}
          ></div>
          <p className={className}>{text}</p>
        </div>
        <button
          onClick={() => {
            setShowingMore(!showingMore);
          }}
          className="text-md mt-1 font-display font-bold text-neutral-600 dark:text-exeter-200"
        >
          {showingMore ? 'Show less' : '...more'}
        </button>
      </div>
    </div>
  );
};

export default ExpandableText;
