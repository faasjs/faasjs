import { useFunc } from '@faasjs/func';
import { useSql } from '@faasjs/sql';
import { Orders } from './order';

export default useFunc(function (){
  const sql = useSql({
    name: 'orders'
  });

  return async function () {
    return await Orders(sql).where({ id: 1 });
  }
});
