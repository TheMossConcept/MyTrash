import * as mongodb from "mongodb";

const DATABASE_NAME = "houe-plastic-recycling";
let globalMongoClientInstace: mongodb.MongoClient;

const getMongoClient = async () => {
  // If the global mongo client is not defined, create it by connecting to the db
  if (!globalMongoClientInstace) {
    globalMongoClientInstace = await mongodb.MongoClient.connect(
      "mongodb://cosmos-houe-plastic-recycling:30OZ6PBjKuwKJfm9S4Wd4Jj1c9zobJbwLKA5j6zcK58UcZ5WCi11mK3tWmppuyiwJbJsxxce6WkvCyFcCtUp0A%3D%3D@cosmos-houe-plastic-recycling.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@cosmos-houe-plastic-recycling@"
    );
  }

  return globalMongoClientInstace;
};

const mongoAPI = {
  insert: async (entity: Entities) => {
    const client = await getMongoClient();
    const insertionResult = await client
      .db(DATABASE_NAME)
      .collection(entity.entityName)
      .insertOne(entity);

    return insertionResult;
  },
};

// TODO: Make these two mutually exclusive so you cannot mix properties from one in the other
type Entities = Cluster;

// TODO: Consider moving these types somewhere else when this file becomes big
type Cluster = {
  entityName: "cluster";
  collectionAdministratorId: string;
  // NB! This is not necessarily a one-to-one
  logisticsPartnerId: string;
  productionPartnerId: string;
  // Derived from the number of furniture ordered, what furniture it is and the plastic required for each
  necessaryPlasticQuantityInKilos: number;
};

export default mongoAPI;
