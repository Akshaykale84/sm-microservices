import '../config/dbConfig.js';
import connectSchema from '../models/connect.js';


class connectApi{

    static create(userId){
        const connectionData={};
        connectionData.userId = userId;
        connectionData.followers = [];
        connectionData.following = [];
        connectionData.noOfFollowers = 0;
        connectionData.noOfFollowings = 0;
        return new Promise((resolve, reject)=>{
            try {
                const connect = new connectSchema(connectionData);
                const result = connect.save();
                resolve(result);
            } catch (e) {
                console.log(e);
                reject("messed up")
            }
        })

    }

    static follow(data){
        const followerId = data.followerId;
        const followeeId = data.followeeId;

        return new Promise(async (resolve, reject)=>{
            try{
                const follower = await connectSchema.updateOne({userId: followerId}, {$push: {following: followeeId}, $inc: {noOfFollowings: 1}});
                const followee = await connectSchema.updateOne({userId: followeeId}, {$push: {followers: followerId}, $inc: {noOfFollowers: 1}});
                resolve("success");
            } catch(e){
                console.log(e);
                reject("messed up")
            }
        })
    }

    static unFollow(data){
        const unFollowerId = data.unFollowerId;
        const unFolloweeId = data.unFolloweeId;

        return new Promise(async (resolve, reject)=>{
            try{
                const unFollower = await connectSchema.updateOne({userId: unFollowerId}, {$pull: {following: unFolloweeId}, $inc: {noOfFollowings: -1}});
                const unFollowee = await connectSchema.updateOne({userId: unFolloweeId}, {$pull: {followers: unFollowerId}, $inc: {noOfFollowers: -1}});
                resolve("success");
            } catch(e){
                console.log(e);
                reject("messed up")
            }
        })
    }

}

export default connectApi;