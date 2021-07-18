import React, { FC, useState } from "react";
import { View } from "react-native";
import WebButton from "../styled/WebButton";
import InformationField from "../styled/InformationField";

type PlasticCollectionDetailProps = {
  plasticCollection: PlasticCollection;
  hideWeight?: boolean;
};

// TODO: This should come autogenerated from the backend!
export type PlasticCollection = {
  id: string;
  clusterId: string;
  requesterId: string;
  recipientPartnerId: string;
  numberOfUnits: number;
  streetAddress: string;
  city: string;
  zipCode: string;
  isFirstCollection: boolean;
  isLastCollection: boolean;
  companyName?: string;
  comment?: string;
  scheduledPickupDate?: string;
  weight?: number;
  collectionStatus: "pending" | "scheduled" | "delivered" | "received";
};

// TODO: Unify this with BatchDetail!!
const PlasticCollectionDetail: FC<PlasticCollectionDetailProps> = ({
  plasticCollection,
  hideWeight = false,
  children,
}) => {
  const {
    companyName,
    streetAddress,
    zipCode,
    city,
    numberOfUnits,
    comment,
    weight,
  } = plasticCollection;
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => setShowDetails(!showDetails);

  const title = companyName || streetAddress;
  const addressString =
    streetAddress && (zipCode || city)
      ? `${streetAddress || ""}, ${zipCode || ""} ${city || ""}`
      : `${streetAddress || ""} ${zipCode || ""} ${city || ""}`;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <View style={{ flex: 1 }}>
        <WebButton
          icon={{
            src: require("../../assets/icons/dropdown_grey.png"),
            width: 29,
            height: 29,
          }}
          onPress={toggleDetails}
          isSelected={showDetails}
          style={{ width: 512 }}
          text={title}
        />
      </View>
      {showDetails && (
        <View style={styles.detailsContainer}>
          {addressString && (
            <InformationField value={addressString} style={[styles.line]} />
          )}
          {numberOfUnits !== undefined && numberOfUnits !== null && (
            <InformationField
              value={`${numberOfUnits} enheder`}
              style={[styles.line]}
            />
          )}
          {comment && (
            <InformationField
              value={comment}
              style={[styles.line, styles.commentField]}
            />
          )}
          {children}
        </View>
      )}
    </View>
    /* (
    <Card style={styles.card}>
      <TouchableOpacity onPress={toggleDetails}>
        <Card.Title title={title} />
      </TouchableOpacity>
      {showDetails && (
        <Card.Content style={styles.cardContent}>
          {companyName && <InformationText>{companyName}</InformationText>}
          <InformationText>
            {streetName} {streetNumber}
          </InformationText>
          <InformationText>
            {city} {zipCode}
          </InformationText>
          {comment && <InformationText>{comment}</InformationText>}
          {weight && !hideWeight && (
            <InformationText>Vægt: {weight}kg</InformationText>
          )}
          <Text>
            Antal enheder{" "}
            <Badge
              visible
              style={{ backgroundColor: colors.primary }}
              size={30}
            >
              {numberOfUnits}
            </Badge>
          </Text>
          {children}
        </Card.Content>
      )}
    </Card>
  ) */
  );
};

type Props = {
  plasticCollections: PlasticCollection[];
  hideWeight?: boolean;
  children?: (plasticCollection: PlasticCollection) => React.ReactNode;
};

const PlasticCollectionsDetails: FC<Props> = ({
  plasticCollections,
  hideWeight = false,
  children,
}) => {
  return (
    <View>
      {plasticCollections.map((collection, index) => {
        const isLastCollection = index === plasticCollections.length - 1;

        return (
          <View
            style={!isLastCollection ? styles.line : undefined}
            key={collection.id}
          >
            <PlasticCollectionDetail
              plasticCollection={collection}
              hideWeight={hideWeight}
            >
              {children && children(collection)}
            </PlasticCollectionDetail>
          </View>
        );
      })}
    </View>
  );
};

const styles = {
  line: {
    marginBottom: 23,
  },
  detailsContainer: {
    marginLeft: 14,
    width: 512,
  },
  commentField: {
    height: 68,
    textAlignVertical: "center",
  },
};

export default PlasticCollectionsDetails;
