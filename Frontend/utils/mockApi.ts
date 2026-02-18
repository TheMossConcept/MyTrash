/**
 * Mock API interceptor for local development without Azure AD B2C and backend.
 * Intercepts all axios requests and returns realistic mock data.
 */
import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── App Roles ───────────────────────────────────────────────────────────────

const mockAppRoles = [
  { id: "Administrator", displayName: "Administration", multilineDisplayName: "Administration" },
  { id: "CollectionAdministrator", displayName: "Indsamlingsadministration", multilineDisplayName: "Indsamlings-\nadministration" },
  { id: "Collector", displayName: "Indsamling", multilineDisplayName: "Indsamling" },
  { id: "LogisticsPartner", displayName: "Logistik", multilineDisplayName: "Logistik" },
  { id: "RecipientPartner", displayName: "Modtagelse", multilineDisplayName: "Modtagelse" },
  { id: "ProductionPartner", displayName: "Produktion", multilineDisplayName: "Produktion" },
];

// ─── Partners / Collaborators ────────────────────────────────────────────────

const mockCollaborators = [
  { id: "partner-admin-1", displayName: "HOUE Administration" },
  { id: "partner-coladmin-1", displayName: "Odense Indsamling ApS" },
  { id: "partner-coladmin-2", displayName: "KBH Grøn Koordinering" },
  { id: "partner-coladmin-3", displayName: "Nordjysk Indsamlingsservice" },
  { id: "partner-logistics-1", displayName: "ReCollect Logistics A/S" },
  { id: "partner-logistics-2", displayName: "GreenHaul Transport ApS" },
  { id: "partner-logistics-3", displayName: "EcoMove Danmark" },
  { id: "partner-recipient-1", displayName: "Nordic Plastic Reception ApS" },
  { id: "partner-recipient-2", displayName: "CircularHub Modtagelse A/S" },
  { id: "partner-production-1", displayName: "HOUE Produktion A/S" },
  { id: "partner-production-2", displayName: "ReNew Materials ApS" },
];

// ─── Clusters ────────────────────────────────────────────────────────────────

const mockClusters = [
  {
    id: "cluster-1",
    displayName: "Odense Centrum",
    name: "Odense Centrum",
    c5Reference: "C5-2024-0012",
    open: true,
    closedForCollection: false,
    necessaryAmountOfPlastic: 5000,
    usefulPlasticFactor: 65,
    logisticsPartnerId: "partner-logistics-1",
    recipientPartnerId: "partner-recipient-1",
    productionPartnerId: "partner-production-1",
    collectionAdministratorId: "partner-coladmin-1",
  },
  {
    id: "cluster-2",
    displayName: "København Vesterbro",
    name: "København Vesterbro",
    c5Reference: "C5-2024-0034",
    open: false,
    closedForCollection: false,
    necessaryAmountOfPlastic: 8000,
    usefulPlasticFactor: 70,
    logisticsPartnerId: "partner-logistics-2",
    recipientPartnerId: "partner-recipient-1",
    productionPartnerId: "partner-production-1",
    collectionAdministratorId: "partner-coladmin-2",
  },
  {
    id: "cluster-3",
    displayName: "Aarhus Midtby",
    name: "Aarhus Midtby",
    c5Reference: "C5-2024-0056",
    open: true,
    closedForCollection: false,
    necessaryAmountOfPlastic: 6500,
    usefulPlasticFactor: 68,
    logisticsPartnerId: "partner-logistics-1",
    recipientPartnerId: "partner-recipient-2",
    productionPartnerId: "partner-production-1",
    collectionAdministratorId: "partner-coladmin-1",
  },
  {
    id: "cluster-4",
    displayName: "Aalborg Havnefront",
    name: "Aalborg Havnefront",
    c5Reference: "C5-2024-0078",
    open: false,
    closedForCollection: false,
    necessaryAmountOfPlastic: 4200,
    usefulPlasticFactor: 62,
    logisticsPartnerId: "partner-logistics-3",
    recipientPartnerId: "partner-recipient-1",
    productionPartnerId: "partner-production-2",
    collectionAdministratorId: "partner-coladmin-3",
  },
  {
    id: "cluster-5",
    displayName: "Roskilde Bæredygtighed",
    name: "Roskilde Bæredygtighed",
    c5Reference: "C5-2024-0090",
    open: true,
    closedForCollection: false,
    necessaryAmountOfPlastic: 3800,
    usefulPlasticFactor: 72,
    logisticsPartnerId: "partner-logistics-2",
    recipientPartnerId: "partner-recipient-2",
    productionPartnerId: "partner-production-1",
    collectionAdministratorId: "partner-coladmin-2",
  },
  {
    id: "cluster-6",
    displayName: "Esbjerg Havn Projekt",
    name: "Esbjerg Havn Projekt",
    c5Reference: "C5-2024-0102",
    open: false,
    closedForCollection: false,
    necessaryAmountOfPlastic: 7500,
    usefulPlasticFactor: 58,
    logisticsPartnerId: "partner-logistics-1",
    recipientPartnerId: "partner-recipient-1",
    productionPartnerId: "partner-production-1",
    collectionAdministratorId: "partner-coladmin-1",
  },
  {
    id: "cluster-7",
    displayName: "Horsens Grøn Omstilling",
    name: "Horsens Grøn Omstilling",
    c5Reference: "C5-2023-0087",
    open: false,
    closedForCollection: true,
    necessaryAmountOfPlastic: 3000,
    usefulPlasticFactor: 60,
    logisticsPartnerId: "partner-logistics-3",
    recipientPartnerId: "partner-recipient-2",
    productionPartnerId: "partner-production-2",
    collectionAdministratorId: "partner-coladmin-3",
  },
  {
    id: "cluster-8",
    displayName: "Vejle Pilotprojekt 2023",
    name: "Vejle Pilotprojekt 2023",
    c5Reference: "C5-2023-0045",
    open: false,
    closedForCollection: true,
    necessaryAmountOfPlastic: 2500,
    usefulPlasticFactor: 55,
    logisticsPartnerId: "partner-logistics-1",
    recipientPartnerId: "partner-recipient-1",
    productionPartnerId: "partner-production-1",
    collectionAdministratorId: "partner-coladmin-1",
  },
  {
    id: "cluster-9",
    displayName: "Sønderborg Zero-Waste",
    name: "Sønderborg Zero-Waste",
    c5Reference: "C5-2023-0023",
    open: false,
    closedForCollection: true,
    necessaryAmountOfPlastic: 1800,
    usefulPlasticFactor: 50,
    logisticsPartnerId: "partner-logistics-2",
    recipientPartnerId: "partner-recipient-2",
    productionPartnerId: "partner-production-2",
    collectionAdministratorId: "partner-coladmin-2",
  },
];

// ─── Collectors ──────────────────────────────────────────────────────────────

const mockCollectors = [
  { id: "collector-1", displayName: "Anders Mogensen", collectionGoal: 100 },
  { id: "collector-2", displayName: "Marie Kjærsgaard", collectionGoal: 150 },
  { id: "collector-3", displayName: "Peter Winther", collectionGoal: 80 },
  { id: "collector-4", displayName: "Sofie Lindqvist", collectionGoal: 200 },
  { id: "collector-5", displayName: "Lars Thomsen", collectionGoal: 120 },
  { id: "collector-6", displayName: "Katrine Bach", collectionGoal: 90 },
  { id: "collector-7", displayName: "Mikkel Østergaard", collectionGoal: 175 },
  { id: "collector-8", displayName: "Emilie Kruse", collectionGoal: 110 },
  { id: "collector-9", displayName: "Jonas Frandsen", collectionGoal: 130 },
  { id: "collector-10", displayName: "Ida Mortensen", collectionGoal: 95 },
  { id: "collector-11", displayName: "Christian Bak", collectionGoal: 160 },
  { id: "collector-12", displayName: "Nanna Søgaard", collectionGoal: 85 },
  { id: "collector-13", displayName: "Frederik Holm", collectionGoal: 140 },
  { id: "collector-14", displayName: "Astrid Vestergaard", collectionGoal: 70 },
  { id: "collector-15", displayName: "Simon Nørgaard", collectionGoal: 115 },
];

// ─── Plastic Collections ─────────────────────────────────────────────────────

const mockPlasticCollections = [
  // --- Pending collections ---
  {
    id: "col-01",
    clusterId: "cluster-1",
    requesterId: "collector-1",
    clusterName: "Odense Centrum",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 3,
    streetAddress: "Vestergade 12",
    city: "Odense C",
    zipCode: "5000",
    isFirstCollection: true,
    isLastCollection: false,
    companyName: "GreenCo ApS",
    comment: "Ring på dørklokken ved ankomst, port kode 4512",
    collectionStatus: "pending",
  },
  {
    id: "col-02",
    clusterId: "cluster-1",
    requesterId: "collector-2",
    clusterName: "Odense Centrum",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 5,
    streetAddress: "Kongensgade 45B",
    city: "Odense C",
    zipCode: "5000",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "PlastikFri A/S",
    comment: "Baggården, indgang til venstre",
    collectionStatus: "pending",
  },
  {
    id: "col-03",
    clusterId: "cluster-2",
    requesterId: "collector-5",
    clusterName: "København Vesterbro",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 8,
    streetAddress: "Istedgade 92",
    city: "København V",
    zipCode: "1650",
    isFirstCollection: false,
    isLastCollection: false,
    comment: "Kælder, brug rampen til højre",
    collectionStatus: "pending",
  },
  {
    id: "col-04",
    clusterId: "cluster-3",
    requesterId: "collector-7",
    clusterName: "Aarhus Midtby",
    recipientPartnerId: "partner-recipient-2",
    numberOfUnits: 4,
    streetAddress: "Frederiksbjerg Torv 3",
    city: "Aarhus C",
    zipCode: "8000",
    isFirstCollection: true,
    isLastCollection: false,
    collectionStatus: "pending",
  },
  {
    id: "col-05",
    clusterId: "cluster-4",
    requesterId: "collector-9",
    clusterName: "Aalborg Havnefront",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 6,
    streetAddress: "Jomfru Ane Gade 17",
    city: "Aalborg",
    zipCode: "9000",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "Nordjysk Genbrug",
    comment: "Åbningstid: 08-16, spørg efter Kim",
    collectionStatus: "pending",
  },

  // --- Scheduled collections ---
  {
    id: "col-06",
    clusterId: "cluster-1",
    requesterId: "collector-3",
    clusterName: "Odense Centrum",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 4,
    streetAddress: "Albanigade 28",
    city: "Odense C",
    zipCode: "5000",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "Odense Genbrugsstation",
    scheduledPickupDate: "2024-03-18T09:00:00Z",
    collectionStatus: "scheduled",
  },
  {
    id: "col-07",
    clusterId: "cluster-2",
    requesterId: "collector-6",
    clusterName: "København Vesterbro",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 12,
    streetAddress: "Enghavevej 40",
    city: "København V",
    zipCode: "1674",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "Vesterbro Miljøcenter",
    comment: "Stor leverance, brug vareelevator",
    scheduledPickupDate: "2024-03-19T10:30:00Z",
    collectionStatus: "scheduled",
  },
  {
    id: "col-08",
    clusterId: "cluster-3",
    requesterId: "collector-8",
    clusterName: "Aarhus Midtby",
    recipientPartnerId: "partner-recipient-2",
    numberOfUnits: 3,
    streetAddress: "Skolegade 11",
    city: "Aarhus C",
    zipCode: "8000",
    isFirstCollection: false,
    isLastCollection: false,
    scheduledPickupDate: "2024-03-20T08:00:00Z",
    collectionStatus: "scheduled",
  },
  {
    id: "col-09",
    clusterId: "cluster-5",
    requesterId: "collector-10",
    clusterName: "Roskilde Bæredygtighed",
    recipientPartnerId: "partner-recipient-2",
    numberOfUnits: 7,
    streetAddress: "Algade 15",
    city: "Roskilde",
    zipCode: "4000",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "Roskilde Genbrugscenter",
    scheduledPickupDate: "2024-03-21T11:00:00Z",
    collectionStatus: "scheduled",
  },
  {
    id: "col-10",
    clusterId: "cluster-6",
    requesterId: "collector-11",
    clusterName: "Esbjerg Havn Projekt",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 9,
    streetAddress: "Havnegade 78",
    city: "Esbjerg",
    zipCode: "6700",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "Esbjerg Havneværksted",
    comment: "Afhentning ved lager 3, kontakt vagten",
    scheduledPickupDate: "2024-03-22T07:30:00Z",
    collectionStatus: "scheduled",
  },

  // --- Delivered collections ---
  {
    id: "col-11",
    clusterId: "cluster-1",
    requesterId: "collector-4",
    clusterName: "Odense Centrum",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 6,
    streetAddress: "Filosofgangen 8",
    city: "Odense C",
    zipCode: "5000",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 38,
    scheduledPickupDate: "2024-03-12T09:00:00Z",
    collectionStatus: "delivered",
  },
  {
    id: "col-12",
    clusterId: "cluster-2",
    requesterId: "collector-5",
    clusterName: "København Vesterbro",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 10,
    streetAddress: "Sønder Boulevard 63",
    city: "København V",
    zipCode: "1720",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "Café Recyclé",
    weight: 64,
    scheduledPickupDate: "2024-03-11T14:00:00Z",
    collectionStatus: "delivered",
  },
  {
    id: "col-13",
    clusterId: "cluster-3",
    requesterId: "collector-7",
    clusterName: "Aarhus Midtby",
    recipientPartnerId: "partner-recipient-2",
    numberOfUnits: 5,
    streetAddress: "Mejlgade 35",
    city: "Aarhus C",
    zipCode: "8000",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 31,
    scheduledPickupDate: "2024-03-10T10:00:00Z",
    collectionStatus: "delivered",
  },
  {
    id: "col-14",
    clusterId: "cluster-4",
    requesterId: "collector-12",
    clusterName: "Aalborg Havnefront",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 8,
    streetAddress: "Østerbro 14",
    city: "Aalborg",
    zipCode: "9000",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "Aalborg Plastgenbrug",
    weight: 52,
    scheduledPickupDate: "2024-03-09T08:30:00Z",
    collectionStatus: "delivered",
  },
  {
    id: "col-15",
    clusterId: "cluster-6",
    requesterId: "collector-13",
    clusterName: "Esbjerg Havn Projekt",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 11,
    streetAddress: "Strandby Kirkevej 20",
    city: "Esbjerg",
    zipCode: "6700",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 73,
    scheduledPickupDate: "2024-03-08T13:00:00Z",
    collectionStatus: "delivered",
  },

  // --- Received collections ---
  {
    id: "col-16",
    clusterId: "cluster-1",
    requesterId: "collector-1",
    clusterName: "Odense Centrum",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 4,
    streetAddress: "Vindegade 53",
    city: "Odense C",
    zipCode: "5000",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 26,
    scheduledPickupDate: "2024-03-01T09:00:00Z",
    collectionStatus: "received",
  },
  {
    id: "col-17",
    clusterId: "cluster-1",
    requesterId: "collector-2",
    clusterName: "Odense Centrum",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 7,
    streetAddress: "Hjallesevej 126",
    city: "Odense SØ",
    zipCode: "5260",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 45,
    scheduledPickupDate: "2024-02-25T10:00:00Z",
    collectionStatus: "received",
  },
  {
    id: "col-18",
    clusterId: "cluster-2",
    requesterId: "collector-6",
    clusterName: "København Vesterbro",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 9,
    streetAddress: "Matthæusgade 18",
    city: "København V",
    zipCode: "1666",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 58,
    scheduledPickupDate: "2024-02-22T11:00:00Z",
    collectionStatus: "received",
  },
  {
    id: "col-19",
    clusterId: "cluster-3",
    requesterId: "collector-8",
    clusterName: "Aarhus Midtby",
    recipientPartnerId: "partner-recipient-2",
    numberOfUnits: 3,
    streetAddress: "Nørregade 7",
    city: "Aarhus C",
    zipCode: "8000",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 19,
    scheduledPickupDate: "2024-02-20T09:30:00Z",
    collectionStatus: "received",
  },
  {
    id: "col-20",
    clusterId: "cluster-2",
    requesterId: "collector-14",
    clusterName: "København Vesterbro",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 6,
    streetAddress: "Vesterbrogade 140",
    city: "København V",
    zipCode: "1620",
    isFirstCollection: false,
    isLastCollection: true,
    companyName: "Vesterbro Beboerhus",
    weight: 41,
    scheduledPickupDate: "2024-02-18T08:00:00Z",
    collectionStatus: "received",
  },
  {
    id: "col-21",
    clusterId: "cluster-4",
    requesterId: "collector-15",
    clusterName: "Aalborg Havnefront",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 5,
    streetAddress: "Danmarksgade 52",
    city: "Aalborg",
    zipCode: "9000",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 33,
    scheduledPickupDate: "2024-02-15T12:00:00Z",
    collectionStatus: "received",
  },
  {
    id: "col-22",
    clusterId: "cluster-5",
    requesterId: "collector-10",
    clusterName: "Roskilde Bæredygtighed",
    recipientPartnerId: "partner-recipient-2",
    numberOfUnits: 4,
    streetAddress: "Hersegade 9",
    city: "Roskilde",
    zipCode: "4000",
    isFirstCollection: false,
    isLastCollection: false,
    weight: 22,
    scheduledPickupDate: "2024-02-12T14:00:00Z",
    collectionStatus: "received",
  },
  {
    id: "col-23",
    clusterId: "cluster-6",
    requesterId: "collector-11",
    clusterName: "Esbjerg Havn Projekt",
    recipientPartnerId: "partner-recipient-1",
    numberOfUnits: 14,
    streetAddress: "Skolegade 36",
    city: "Esbjerg",
    zipCode: "6700",
    isFirstCollection: false,
    isLastCollection: false,
    companyName: "Esbjerg Kommune Miljø",
    weight: 92,
    scheduledPickupDate: "2024-02-08T07:00:00Z",
    collectionStatus: "received",
  },
];

// ─── Batches ─────────────────────────────────────────────────────────────────

const mockBatches = [
  // --- Created batches ---
  {
    id: "batch-01",
    clusterId: "cluster-1",
    clusterName: "Odense Centrum",
    batchNumber: "B-2024-0047",
    inputWeight: 120,
    outputWeight: 95,
    additionFactor: 15,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-03-14T08:30:00Z",
    batchStatus: "created",
  },
  {
    id: "batch-02",
    clusterId: "cluster-2",
    clusterName: "København Vesterbro",
    batchNumber: "B-2024-0048",
    inputWeight: 185,
    outputWeight: 152,
    additionFactor: 12,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-03-13T10:15:00Z",
    batchStatus: "created",
  },
  {
    id: "batch-03",
    clusterId: "cluster-3",
    clusterName: "Aarhus Midtby",
    batchNumber: "B-2024-0049",
    inputWeight: 95,
    outputWeight: 78,
    additionFactor: 18,
    creatorName: "CircularHub Modtagelse A/S",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-03-12T14:00:00Z",
    batchStatus: "created",
  },
  {
    id: "batch-04",
    clusterId: "cluster-6",
    clusterName: "Esbjerg Havn Projekt",
    batchNumber: "B-2024-0050",
    inputWeight: 210,
    outputWeight: 175,
    additionFactor: 10,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-03-11T09:45:00Z",
    batchStatus: "created",
  },

  // --- Sent batches ---
  {
    id: "batch-05",
    clusterId: "cluster-1",
    clusterName: "Odense Centrum",
    batchNumber: "B-2024-0039",
    inputWeight: 145,
    outputWeight: 118,
    additionFactor: 14,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-03-05T11:00:00Z",
    batchStatus: "sent",
  },
  {
    id: "batch-06",
    clusterId: "cluster-2",
    clusterName: "København Vesterbro",
    batchNumber: "B-2024-0040",
    inputWeight: 200,
    outputWeight: 165,
    additionFactor: 12,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-03-04T08:20:00Z",
    batchStatus: "sent",
  },
  {
    id: "batch-07",
    clusterId: "cluster-4",
    clusterName: "Aalborg Havnefront",
    batchNumber: "B-2024-0041",
    inputWeight: 88,
    outputWeight: 71,
    additionFactor: 16,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "ReNew Materials ApS",
    creationDate: "2024-03-03T13:30:00Z",
    batchStatus: "sent",
  },

  // --- Received batches ---
  {
    id: "batch-08",
    clusterId: "cluster-1",
    clusterName: "Odense Centrum",
    batchNumber: "B-2024-0028",
    inputWeight: 160,
    outputWeight: 132,
    additionFactor: 13,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-02-22T09:00:00Z",
    batchStatus: "received",
  },
  {
    id: "batch-09",
    clusterId: "cluster-2",
    clusterName: "København Vesterbro",
    batchNumber: "B-2024-0029",
    inputWeight: 230,
    outputWeight: 190,
    additionFactor: 11,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-02-20T10:00:00Z",
    batchStatus: "received",
  },
  {
    id: "batch-10",
    clusterId: "cluster-3",
    clusterName: "Aarhus Midtby",
    batchNumber: "B-2024-0030",
    inputWeight: 110,
    outputWeight: 89,
    additionFactor: 15,
    creatorName: "CircularHub Modtagelse A/S",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-02-18T12:00:00Z",
    batchStatus: "received",
  },
  {
    id: "batch-11",
    clusterId: "cluster-5",
    clusterName: "Roskilde Bæredygtighed",
    batchNumber: "B-2024-0031",
    inputWeight: 75,
    outputWeight: 60,
    additionFactor: 20,
    creatorName: "CircularHub Modtagelse A/S",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-02-15T08:45:00Z",
    batchStatus: "received",
  },
  {
    id: "batch-12",
    clusterId: "cluster-6",
    clusterName: "Esbjerg Havn Projekt",
    batchNumber: "B-2024-0032",
    inputWeight: 195,
    outputWeight: 160,
    additionFactor: 14,
    creatorName: "Nordic Plastic Reception ApS",
    recipientName: "HOUE Produktion A/S",
    creationDate: "2024-02-10T11:30:00Z",
    batchStatus: "received",
  },
];

// ─── Products ────────────────────────────────────────────────────────────────

const mockProducts = [
  // Products for batch-08 (received, Odense)
  { id: "prod-01", productNumber: 10241, hasBeenSent: true },
  { id: "prod-02", productNumber: 10242, hasBeenSent: true },
  { id: "prod-03", productNumber: 10243, hasBeenSent: false },

  // Products for batch-09 (received, København)
  { id: "prod-04", productNumber: 10244, hasBeenSent: true },
  { id: "prod-05", productNumber: 10245, hasBeenSent: true },
  { id: "prod-06", productNumber: 10246, hasBeenSent: true },
  { id: "prod-07", productNumber: 10247, hasBeenSent: false },
  { id: "prod-08", productNumber: 10248, hasBeenSent: false },

  // Products for batch-10 (received, Aarhus)
  { id: "prod-09", productNumber: 10249, hasBeenSent: false },
  { id: "prod-10", productNumber: 10250, hasBeenSent: false },

  // Products for batch-11 (received, Roskilde)
  { id: "prod-11", productNumber: 10251, hasBeenSent: true },

  // Products for batch-12 (received, Esbjerg)
  { id: "prod-12", productNumber: 10252, hasBeenSent: true },
  { id: "prod-13", productNumber: 10253, hasBeenSent: true },
  { id: "prod-14", productNumber: 10254, hasBeenSent: false },
  { id: "prod-15", productNumber: 10255, hasBeenSent: false },
];

// ─── Derived data ────────────────────────────────────────────────────────────

const mockOpenClusters = mockClusters
  .filter((c) => c.open && !c.closedForCollection)
  .map((c) => ({ id: c.id, displayName: c.displayName }));

// ─── Response router ─────────────────────────────────────────────────────────

function getMockResponse(config: AxiosRequestConfig): any {
  const url = config.url || "";
  const fullUrl = url.startsWith("http") ? url : `${config.baseURL || ""}${url}`;

  const match = (pattern: string) =>
    url.includes(pattern) || fullUrl.includes(pattern);

  if (match("GetAppRoles")) {
    return mockAppRoles;
  }
  if (match("GetClusters")) {
    return mockClusters;
  }
  if (match("GetCluster") && !match("GetClusters")) {
    const clusterId = config.params?.clusterId;
    return mockClusters.find((c) => c.id === clusterId) || mockClusters[0];
  }
  if (match("GetPlasticCollections")) {
    return mockPlasticCollections;
  }
  if (match("GetPlasticCollection") && !match("GetPlasticCollections")) {
    return mockPlasticCollections[0];
  }
  if (match("GetLatestCollection")) {
    return mockPlasticCollections[0];
  }
  if (match("GetBatches")) {
    return mockBatches;
  }
  if (match("GetProducts")) {
    return mockProducts;
  }
  if (match("GetCollectors")) {
    return mockCollectors;
  }
  if (match("GetOpenClusters")) {
    return mockOpenClusters;
  }
  if (match("GetUsersByAppRole")) {
    return mockCollaborators;
  }
  if (match("GetClusterProgressData")) {
    return { totalCollected: 3250, goal: 5000, usefulPlasticFactor: 65 };
  }
  if (match("GetUserProgressData")) {
    return { totalCollected: 78, goal: 100, usefulPlasticFactor: 65 };
  }
  if (match("GetEnvironment")) {
    return { environment: "local" };
  }

  // For POST/DELETE requests (mutations), return success
  return { success: true };
}

// ─── Setup ───────────────────────────────────────────────────────────────────

export function setupMockApi() {
  axios.interceptors.request.use((config) => {
    const mockData = getMockResponse(config);

    config.adapter = () => {
      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });
    };

    return config;
  });

  console.log("[MockAPI] Mock API interceptor installed");
}

export async function mockLogin() {
  await AsyncStorage.setItem("accessToken", "mock-access-token-for-local-dev");

  const mockUserInfo = {
    name: "Louise Mørk",
    userId: "mock-user-id-12345",
    isAdministrator: true,
    isCollectionAdministrator: true,
    isCollector: false,
    isLogisticsPartner: true,
    isRecipientPartner: true,
    isProductionPartner: true,
    userHasNoAccess: false,
  };

  await AsyncStorage.setItem("userInfo", JSON.stringify(mockUserInfo));
  console.log("[MockAPI] Mock user logged in as:", mockUserInfo.name);
}
