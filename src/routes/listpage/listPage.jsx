import './listPage.scss'
import { listData } from '../../lib/dummydata';
import Filter from '../../components/filter/filter';
import Card from '../../components/card/Card';
import Map from '../../components/map/Map';
import { useLoaderData, Await, defer } from 'react-router-dom';
import React, {Suspense} from 'react';

function ListPage(){
  const data = useLoaderData();
  console.log("Here is the data: ", data)
  return (
    <div className='listPage'>
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense
            fallback={<p>Loading...</p>}
          >
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error!</p>}
              >
                {(postResponse) => postResponse.data.data.map(post => (
                  <Card key={post._id} item={post} />
                ))}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense
          fallback={<p>Loading...</p>}
        >
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading package location!</p>}
            >
              {
              (postResponse) => <Map items={postResponse.data.data} />
              }
            </Await>
        </Suspense>
      </div>
    </div>
  )
}

export default ListPage;