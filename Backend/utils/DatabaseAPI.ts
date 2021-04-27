import * as mongodb from "mongodb";

const DATABASE_NAME = "houe-plastic-recycling";
let globalMongoClientInstace: mongodb.MongoClient;

const getMongoClient = async () => {
  // If the global mongo client is not defined, create it by connecting to the db
  if (!globalMongoClientInstace) {
    globalMongoClientInstace = await mongodb.MongoClient.connect(
      // TODO: Move to env!
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
  async update<T extends Entities>(
    entityName: T["entityName"],
    id: string,
    update: mongodb.UpdateQuery<T>
  ) {
    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      .updateOne({ _id: id }, update);

    return result;
  },
  async findById<T extends Entities>(entityName: T["entityName"], id: string) {
    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      .findOne<T>(new mongodb.ObjectId(id));

    return result;
  },
  // I'd love for the entityType to automatically be determined
  // based on the value of T, however, I do not think that is
  // possible in TypeScript at the moment (going from type to
  // value)
  async find<T extends Entities>(
    entityName: T["entityName"],
    query?: mongodb.FilterQuery<T>
  ) {
    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      // TODO: Add the type here!
      .find(query)
      .toArray();

    return result;
  },
  async findOne<T extends Entities>(
    entityName: T["entityName"],
    query?: mongodb.FilterQuery<T>
  ) {
    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      .findOne<T>(query);

    return result;
  },
};

// TODO: Make these two mutually exclusive so you cannot mix properties from one in the other
type Entities =
  | ClusterEntity
  | UserMetadataEntity
  | PlasticBagEntity
  | PlasticBagAggregateEntity
  | PelletEntity
  | ProductEntity
  | CollectionEntity;

// TODO: Consider moving these types somewhere else when this file becomes big
export type ClusterEntity = {
  entityName: "cluster";
  collectionAdministratorId: string;
  // NB! This is not necessarily a one-to-one
  logisticsPartnerId: string;
  productionPartnerId: string;
  recipientPartnerId: string;
  collectors: string[];
  name: string;
  open: boolean;
  c5Reference: string;
  usefulPlasticFactor: number;
  necessaryAmountOfPlastic: number;
};

// TODO: Look into getting this information into AD as well!
export type UserMetadataEntity = {
  entityName: "userMetadata";
  azureAdId: string;
  companyName: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: number;
};

export type PlasticBagEntity = {
  entityName: "plasticBag";
  clusterId: string;
};

export type PlasticBagAggregateEntity = {
  entityName: "plasticBagAggregate";
  clusterId: string;
};

export type PelletEntity = {
  entityName: "pellet";
  clusterId: string;
};

export type ProductEntity = {
  entityName: "product";
  clusterId: string;
};

export type CollectionEntity = {
  entityName: "collection";
  requesterId: string;
  clusterId: string;
  logisticsPartnerId: string;
  recipientPartnerId: string;
  numberOfUnits: number;
  weight?: number;
  comment?: string;
  hasBeenCollected: boolean;
  hasBeenReceived: boolean;
  scheduledPickupTime: Date;
  collectionStatus: "pending" | "scheduled" | "delivered" | "received";
};

export default mongoAPI;
