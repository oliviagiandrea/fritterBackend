import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Follower = {
  _id: {follower: Types.ObjectId; followee: Types.ObjectId};
};
export type PopulatedFollower = {
  _id: {follower: User; followee: User};
};

const FollowerSchema = new Schema<Follower>({
  _id: {
    follower: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    followee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});

const FollowerModel = model<Follower>('Follower', FollowerSchema);
export default FollowerModel;
