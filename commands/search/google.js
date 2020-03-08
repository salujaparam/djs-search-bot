const axios = require("axios");
const {MongoClient} = require('mongodb');

const uri = 'mongodb+srv://admin:abcdef123456@cluster0-gospk.mongodb.net/test?retryWrites=true&w=majority';
module.exports = {
    name: "google",
    category: "search",
    description: "Returns google search results",
    run: async (client, message, args) => {
        const search = args.join(" ")
        const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyCEcIrfHCequOQ9EbRdhk_lb42a3VSTM2k&cx=001970019635730912291:7guzasm6jqx&q=${search}`
        let data;
        await axios.get(url)
            .then(res => {
                data = res.data.items
            })
            .catch(e => {
                console.log(e)
            })
        if(data===undefined){
            message.channel.send("Google search requires atleast one keyword to search for...")
            return;
        }
        const firstFive = data.splice(0,5);
        let msg = ``
        for(let item of firstFive){
            msg = msg + `${item.title}\n${item.link}\n${item.snippet}\n\n`
        }
        message.channel.send(msg)
        let mongoClient;
        try {
            mongoClient = await MongoClient.connect(uri,{ useUnifiedTopology: true });
            const db = mongoClient.db("search")
            const collection = db.collection("recent")
            // // perform actions on the collection object
            collection.insertOne({name:search}, (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
            })
            // mongoClient.close()
        }
        catch(e) { 
            console.log(e)
        }
        // finally{
        //     mongoClient.close();
        // }
    }
}