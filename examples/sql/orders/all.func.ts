import { useFunc } from '@faasjs/func';
import { useSql } from '@faasjs/sql';
import { Orders, Order } from './order';

export default useFunc(function (){
  const sql = useSql({
    name: 'orders'
  });

  return async function () {
    const list: Order[] = await Orders(sql);

    return list;
  }
});
