import { useFunc } from '@faasjs/func';
import { useSql } from '@faasjs/sql';
import { Users } from './user';

export default useFunc(function (){
  const sql = useSql({
    name: 'users'
  })
  return async function () {
    return await Users(sql).where({ id: 1 });
  }
});
