import type { NextPage } from 'next';
import MapComponent from '../components/mapComponent';

const Map: NextPage = () => {
  return (
    <div>
      <div className="bg-exeter px-8 pt-16 pb-0 lg:px-40"></div>
      <MapComponent />
    </div>
  );
};

export default Map;
