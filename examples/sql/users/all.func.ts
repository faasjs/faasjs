import { useFunc } from '@faasjs/func';
import { useSql } from '@faasjs/sql';
import { Users, User } from './user';

export default useFunc(function (){
  const sql = useSql({
    name: 'users'
  });

  return async function () {
    const list: User[] = await Users(sql);

    return list;
  }
});
