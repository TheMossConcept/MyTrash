const mongoClient = require("mongodb").MongoClient;

const connectToMongoClient = () => {
  mongoClient.connect(
    "mongodb://cosmos-houe-plastic-recycling:30OZ6PBjKuwKJfm9S4Wd4Jj1c9zobJbwLKA5j6zcK58UcZ5WCi11mK3tWmppuyiwJbJsxxce6WkvCyFcCtUp0A%3D%3D@cosmos-houe-plastic-recycling.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmos-houe-plastic-recycling@",
    function (err, client) {
      console.log(client);
      client.close();
    }
  );
};

export default connectToMongoClient;
