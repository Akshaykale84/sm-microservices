import express from 'express';
import createPost from './routes/create.js';
import removePost from './routes/remove.js';
import getPost from './routes/get.js';
import cors from 'cors';
import cron from 'node-cron';
import PostModel from './models/posts.js'
import LikeModel from './models/likes.js'
import mongoose from 'mongoose';
import 'dotenv/config'
const app = express();

import http from 'http';
import { Server } from 'socket.io';
import { Console } from 'console';
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use('/posts/create', createPost);
app.use('/posts/remove', removePost);
app.use('/posts/get', getPost);

app.get('/posts', (req, res) => {
    res.send("post home");
});

// app.listen(9000);




const PORT = process.env.PORT || 9000;
var client;
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Track sent postIds for each client to avoid duplicates
const clientSentPostIds = new Map();
const connectedUsers = new Map();

// Get the total count of documents in the collection
let totalPostCount;

// (async () => {
//     try {
//         totalPostCount = await PostModel.countDocuments();
//         console.log(`Total posts: ${totalPostCount}`);
//     } catch (error) {
//         console.error('Error fetching total post count:', error.message);
//         process.exit(1);
//     }
// })();
async function fetchTotalPostCount() {
    try {
        totalPostCount = await PostModel.countDocuments();
        console.log(`Total posts: ${totalPostCount}`);
        return totalPostCount;
    } catch (error) {
        console.error('Error fetching total post count:', error.message);
    }
}

// Call the function when needed
fetchTotalPostCount();


io.on('connection', (socket) => {
    console.log('A client connected');
    var sendData = true;
    const getPostLikes = async (postId) => {
        let likes = await LikeModel.findOne({postId: postId}, {noOfLikes:1, _id: 0});
        return likes.noOfLikes;
    }
    
    const getLikeDetails = async(userId, postId) => {
        try {
            const result = await LikeModel.aggregate([
              {
                $match: {
                  postId: postId
                }
              },
              {
                $project: {
                  likes: { $size: "$likes" },
                  isLiked: {
                    $in: [userId, "$likes"]
                  },
                  _id: 0
                }
              }
            ]).exec();
            
            // console.log("Result:", result[0]);
            return result[0];
            // Process result
          } catch (err) {
            console.error("Error:", err);
            // Handle error
          }
    }

    const isPostLikedByUser = async(userId, postId) => {
        let isLiked = await LikeModel.findOne({postId: postId, likes: { $in: [userId]}})
        if (isLiked){
            console.log(isLiked);
            return true
        }
        return false
    }

    const getRandomPost = async (clientId) => {
        try {
            let randomPost;
            do {
                randomPost = await PostModel.findOne().skip(Math.floor(Math.random() * totalPostCount));
            } while (clientSentPostIds.get(clientId)?.has(randomPost.postId));
            // randomPost.likes = await getPostLikes(randomPost.postId)
            // randomPost.isLiked = await isPostLikedByUser(connectedUsers.get(socket.id), randomPost.postId);
            const { likes, isLiked } = await getLikeDetails(connectedUsers.get(socket.id), randomPost.postId);
            randomPost.likes = likes;
            randomPost.isLiked = isLiked;
            if(randomPost.isLiked) console.log(randomPost);
            return randomPost;
        } catch (error) {
            console.error('Error fetching random post:', error.message);
            throw error;
        }
    };

    // Emit random posts to the client
    const emitRandomPosts = async (clientId) => {
        try {
            const randomPost = await getRandomPost(clientId);
            // Check if the clientId has a set of sent postIds
            if (!clientSentPostIds.has(clientId)) {
                clientSentPostIds.set(clientId, new Set());
            }

            // Check if the postId has been sent to this client before
            if (!clientSentPostIds.get(clientId).has(randomPost.postId)) {
                // Emit the post data
                socket.emit('feedUpdate', randomPost);

                // Add postId to the set of sent postIds for this client
                clientSentPostIds.get(clientId).add(randomPost.postId);
            }
            if(clientSentPostIds.get(clientId).size == totalPostCount - 20){
                clientSentPostIds.get(clientId).clear();
            }
            // If there are still posts to send, set a timeout for the next emit
            if (clientSentPostIds.get(clientId).size < totalPostCount && sendData && connectedUsers.get(clientId)) {
                setTimeout(() => emitRandomPosts(clientId), 100); // Adjust the delay as needed
            }
        } catch (error) {
            console.error('Error emitting random posts:', error.message);
        }
    };
    client = socket.id
    // Start emitting random posts for the specific client
    socket.on('stop', (data) => {
        sendData = false;
        console.log(data);
    })

    socket.on('start', (data) => {
        sendData = true;
        emitRandomPosts(socket.id);
        console.log("start");
        connectedUsers.set(socket.id, data)
    })

    socket.on('disconnect', ()=>{
        clientSentPostIds.delete(socket.id);
        connectedUsers.delete(socket.id);
        console.log(clientSentPostIds);
        console.log(connectedUsers);
    })

    socket.on('test', (data) =>{
        console.log(clientSentPostIds);
        console.log(connectedUsers);
    })

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    fetchTotalPostCount();
  
  })

//   const isPostLikedByUser = async(userId, postId) => {
//     let isLiked = await LikeModel.findOne({postId: postId, likes: { $in: [userId]}})
//     console.log(isLiked);
// }

// setInterval(()=>{
//     isPostLikedByUser('user-3b8ec5cf-7fe1-4210-bbf8-43f9e9e181de','post-ba793e7d-0d20-4217-b4fc-79c6aac2879c')
// },10000)
