import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import useQueriedData from "../../hooks/useQueriedData";
import HeadlineText from "../styled/HeadlineText";
import CollectorForm from "./CollectorForm";
import CollectorList, { Collector } from "./CollectorList";

type Props = { clusterId: string; title: string };

const CollectorFormWithList: FC<Props> = ({ clusterId, title }) => {
  const {
    data: collectors,
    refetch,
    isLoading,
  } = useQueriedData<Collector[]>("/GetCollectors", {
    clusterId,
  });

  return (
    <View style={styles.container}>
      <HeadlineText text={title} style={styles.headlineTitle} />
      <CollectorForm
        clusterId={clusterId}
        title={title}
        successCallback={refetch}
        style={styles.collectorForm}
      />
      <CollectorList
        collectors={collectors || []}
        isLoading={isLoading}
        refetch={refetch}
        clusterId={clusterId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headlineTitle: { alignItems: "flex-start" },
  collectorForm: { marginBottom: 23 },
});

export default CollectorFormWithList;
