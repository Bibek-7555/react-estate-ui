import './listPage.scss'
import { listData } from '../../lib/dummydata';
import Filter from '../../components/filter/filter';
import Card from '../../components/card/Card';
import Map from '../../components/map/Map';

function ListPage(){
  const data=listData;
  return (
    <div className='listPage'>
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          {data.map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div>
      </div>
      <div className="mapContainer">
        <Map items={data}/>
      </div>
    </div>
  )
}

export default ListPage;