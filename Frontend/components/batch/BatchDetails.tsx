import { DateTime } from "luxon";
import React, { FC, useState } from "react";
import { View, ViewProps } from "react-native";
import EmptyView from "../styled/EmptyView";
import InformationField from "../styled/InformationField";
import WebButton from "../styled/WebButton";

// TODO: This should come autogenerated from the backend
// once we have end-to-end typings!!
export type Batch = {
  id: string;
  clusterId: string;
  batchNumber: string;
  inputWeight: number;
  outputWeight: number;
  additionFactor: number;
  creatorName: string;
  recipientName: string;
  creationDate: string;
  batchStatus: "created" | "sent" | "received";
};

type BatchDetailProps = { batch: Batch };

// TODO: Unify this with PlasticCollectionDetail!!
const BatchDetail: FC<BatchDetailProps> = ({ batch, children }) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => setShowDetails(!showDetails);

  const creationDateTime = DateTime.fromISO(batch.creationDate);
  const title = `Batch nummer ${
    batch.batchNumber
  } oprettet d ${creationDateTime.toLocaleString({
    month: "long",
    day: "2-digit",
  })}`;
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
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
        <View style={{ width: 512, marginLeft: 14 }}>
          <InformationField
            value={`Forbrugt plast ${batch.inputWeight} kg`}
            style={styles.informationField}
          />
          <InformationField
            value={`Batch vægt ${batch.outputWeight} kg`}
            style={styles.informationField}
          />
          <InformationField
            value={`Tilsætningsprocent ${batch.additionFactor}%`}
            style={styles.informationField}
          />
          {children}
        </View>
      )}
    </View>
  );
};

type Props = {
  batches: Batch[];
  sorting?: {
    displayName: string;
    sortState: [boolean, (newValue: boolean) => void];
  };
  children?: (batch: Batch) => React.ReactNode;
} & ViewProps;

const BatchDetails: FC<Props> = ({
  batches,
  sorting,
  children,
  style,
  ...viewProps
}) => {
  const [sort, setSort] = sorting ? sorting.sortState : [false, undefined];
  const toggleSort = setSort ? () => setSort(!sort) : undefined;

  return batches.length === 0 ? (
    <EmptyView textStyle={{ textAlign: "left" }} />
  ) : (
    <View style={style} {...viewProps}>
      {sorting && (
        <WebButton
          text={`Sorter efter ${sorting.displayName}`}
          icon={{
            src: require("../../assets/icons/calendar_grey.png"),
            width: 25,
            height: 25,
          }}
          onPress={toggleSort}
          isSelected={sort}
          style={styles.filterButton}
        />
      )}
      {batches.map((batch, index) => {
        const isLastBatch = index === batches.length - 1;

        return (
          <View style={!isLastBatch ? styles.line : undefined} key={batch.id}>
            <BatchDetail batch={batch}>
              {children && children(batch)}
            </BatchDetail>
          </View>
        );
      })}
    </View>
  );
};

const styles = {
  informationField: {
    marginBottom: 23,
  },
  line: {
    marginBottom: 23,
  },
  filterButton: {
    width: 512,
    marginBottom: 23,
  },
};

export default BatchDetails;
