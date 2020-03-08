// const {MongoClient} = require('mongodb');

// const uri = 'mongodb+srv://admin:abcdef123456@cluster0-gospk.mongodb.net/test?retryWrites=true&w=majority';

// try{
//     MongoClient.connect(uri,{ useUnifiedTopology: true }, function(err, client) {
//         if(err) {
//              console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
//         }
//         console.log('Connected...');
//         const db = client.db("search")
//         const collection = db.collection("recent")
//         // // perform actions on the collection object
//         collection.insertOne({name:"Youtube"}, (err, result) => {
//             if(err){
//                 console.log(err)
//                 return
//             }
//             console.log(result)
//         })
//         console.log(collection)
//         // collection.find().toArray(function(err, items) {
//         //     if(err) {
//         //         console.log(err)
//         //         return
//         //     }
//         //     console.log(items)
//         // });
//         // client.close();
//      });
// }

// catch(e){
//     console.log(e)
// }
const {MongoClient} = require('mongodb');

const uri = 'mongodb+srv://admin:abcdef123456@cluster0-gospk.mongodb.net/test?retryWrites=true&w=majority';
module.exports = {
    name: "recent",
    category: "search",
    description: "Returns list of recent google searches",
    run: async (client, message, args) => {
        const search = args[0];
        if(search===undefined){
            message.channel.send("The command requires a keyword to search for...")
            return;
        }
        let mongoClient;
        try {
            mongoClient = await MongoClient.connect(uri,{ useUnifiedTopology: true });
            const db = mongoClient.db("search")
            const collection = db.collection("recent")
            await collection.find().toArray(function(err, items) {
                if(err) {
                    console.log(err)
                    return
                }
                let msg = ``
                for(item of items){
                    if(item.name.includes(search)){
                        msg = msg + `"${item.name}" `
                    }
                }
                if(msg===``){
                    message.channel.send("Cannot find the item you're looking for in our recent searches")
                    return
                }
                message.channel.send(msg)
            });
        }
        catch(e) { 
            console.log(e)
        }
        // finally{
        //     mongoClient.close();
        // }
    }
}