import './list.scss'
import { listData } from '../../lib/dummydata'
import Card from '../card/Card'

function List({items}){
  console.log("From List: ", items)
  return (
    <div className='list'>
        {items.map((item) => (
            <Card item={item} key={item._id} />
        ))}
    </div>
  )
}

export default List