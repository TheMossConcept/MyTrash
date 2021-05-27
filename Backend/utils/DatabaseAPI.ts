import * as mongodb from "mongodb";

const DATABASE_NAME = "houe-plastic-recycling";
let globalMongoClientInstace: mongodb.MongoClient;

const getMongoClient = async () => {
  // If the global mongo client is not defined, create it by connecting to the db
  if (!globalMongoClientInstace) {
    globalMongoClientInstace = await mongodb.MongoClient.connect(
      // TODO: Move to env!
      "mongodb://cosmos-houe-mytrash-serverless:gMCgVFsAMYZhJ7Jonq66mCgmv4lYM78LDVzNsa4XhTxyWxJS135MCox9O1d7O9gey5ILDq8XIBLxSMI5TNqPaQ==@cosmos-houe-mytrash-serverless.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@cosmos-houe-mytrash-serverless@",
      { useUnifiedTopology: true }
    );
  }

  return globalMongoClientInstace;
};

type PaginationResult<T> = {
  result: Array<T & DatabaseEntity>;
  hasNextPage: boolean;
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
  async updateOne<T extends Entities>(
    entityName: T["entityName"],
    id: string,
    update: mongodb.UpdateQuery<T>
  ) {
    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      .updateOne({ _id: new mongodb.ObjectId(id) }, update);

    return result;
  },
  async findById<T extends Entities>(
    entityName: T["entityName"],
    id: string
  ): Promise<T & DatabaseEntity> {
    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      .findOne<T & DatabaseEntity>(new mongodb.ObjectId(id));

    return result;
  },
  // I'd love for the entityType to automatically be determined
  // based on the value of T, however, I do not think that is
  // possible in TypeScript at the moment (going from type to
  // value)
  async find<T extends Entities>(
    entityName: T["entityName"],
    query?: mongodb.FilterQuery<T>
  ): Promise<(T & DatabaseEntity)[]> {
    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      // TODO: Add the type here!
      .find(query)
      .toArray();

    return result;
  },

  // TODO: Implement cursor pagination at some point as well!
  async findPaginated<T extends Entities>(
    entityName: T["entityName"],
    // NB! Starts a 0
    page: number,
    query?: mongodb.FilterQuery<T>,
    limit: number = 5
  ): Promise<PaginationResult<T>> {
    const skipEntities = page * limit;

    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      // TODO: Add the type here!
      .find(query, { sort: { _id: 1 }, skip: skipEntities, limit })
      .toArray();

    // NB! This is not entirely true. If the last page has
    // exactly 5 entries, the next page might be empty, however,
    // we cannot know from the information available. This will
    // prevent next page queries in all cases where the number of
    // entries in the current page is less than 5
    const hasNextPage = !(result.length < limit);
    return { result, hasNextPage };
  },
  async findOne<T extends Entities>(
    entityName: T["entityName"],
    query?: mongodb.FilterQuery<T>
  ): Promise<T & DatabaseEntity> {
    const client = await getMongoClient();
    const result = await client
      .db(DATABASE_NAME)
      .collection(entityName)
      .findOne<T & DatabaseEntity>(query);

    return result;
  },
};

type DatabaseEntity = { _id: string };

// TODO: Make these two mutually exclusive so you cannot mix properties from one in the other
type Entities = ClusterEntity | ProductEntity | CollectionEntity | BatchEntity;
// TODO: At the moment, this is the source of truth. Eventually, the source of
// truth should be the names of the actual custom attributes added in the AD
export const allUserRoles = [
  "Administrator",
  "CollectionAdministrator",
  "Collector",
  "LogisticsPartner",
  "RecipientPartner",
  "ProductionPartner",
] as const;

// See https://stackoverflow.com/questions/44480644/string-union-to-string-array
type UserRoleType = typeof allUserRoles;

export type UserRole = UserRoleType[-1];

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

export type CollectionEntity = {
  entityName: "collection";
  isFirstCollection: boolean;
  isLastCollection: boolean;
  requesterId: string;
  clusterId: string;
  logisticsPartnerId: string;
  recipientPartnerId: string;
  numberOfUnits: number;
  weight?: number;
  comment?: string;
  scheduledPickupDate?: Date;
  collectionStatus: "pending" | "scheduled" | "delivered" | "received";
};

export type BatchEntity = {
  entityName: "batch";
  clusterId: string;
  inputWeight: number;
  outputWeight: number;
  addtionFactor: number;
  recipientPartnerId: string;
  productionPartnerId: string;
  batchStatus: "created" | "sent" | "received";
};

export type ProductEntity = {
  entityName: "product";
  clusterId: string;
  productionPartnerId: string;
  batchId: string;
  hasBeenSent: boolean;
  productNumber: string;
};

export default mongoAPI;
