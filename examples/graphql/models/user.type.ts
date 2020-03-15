import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

@Entity('users')
@ObjectType('User', { description: '用户' })
export class User {
  @Column({ primary: true })
  @Field()
  username: string;

  @Column()
  @Field()
  password: string;
}
