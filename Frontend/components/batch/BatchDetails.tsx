import { DateTime } from "luxon";
import React, { FC } from "react";
import { Text, View } from "react-native";
import { List } from "react-native-paper";

// TODO: This should come autogenerated from the backend
// once we have end-to-end typings!!
export type Batch = {
  id: string;
  inputWeight: number;
  outputWeight: number;
  creatorName: string;
  recipientName: string;
  creationDate: Date;
  batchStatus: "created" | "sent" | "received";
};

type BatchDetailProps = { batch: Batch };

const BatchDetail: FC<BatchDetailProps> = ({ batch }) => {
  const creationDateTime = DateTime.fromJSDate(batch.creationDate);
  const title = `Oprettet af ${
    batch.creatorName
  } d ${creationDateTime.toLocaleString({ month: "long", day: "2-digit" })}`;
  return (
    <List.Accordion title={title}>
      <Text>Plast input: {batch.inputWeight}kg</Text>
      <Text>Batch vægt: {batch.inputWeight}kg</Text>
      <Text>Batch oprettet af: {batch.creatorName}</Text>
      {batch.recipientName && (
        <Text>Batch sendt til: {batch.recipientName}</Text>
      )}
    </List.Accordion>
  );
};

type Props = {
  batches: Batch[];
  title: string;
  children?: (batch: Batch) => React.ReactNode;
};

const BatchDetails: FC<Props> = ({ batches, title, children }) => {
  return (
    <List.Section>
      <List.Subheader>{title}</List.Subheader>
      {batches.map((batch) => (
        <View key={batch.id}>
          <BatchDetail batch={batch}>{children && children(batch)}</BatchDetail>
        </View>
      ))}
    </List.Section>
  );
};

export default BatchDetails;
