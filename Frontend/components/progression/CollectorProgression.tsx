import React, { FC } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import useQueriedData from "../../hooks/useQueriedData";
import AppText from "../styled/AppText";
import ProgressionCircle, { ProgressionData } from "./ProgressionCircle";

type ClusterViewForCollectorProps = {
  userId: string;
  clusterId: string;
} & ViewProps;

const CollectorProgression: FC<ClusterViewForCollectorProps> = ({
  userId,
  clusterId,
  style,
  ...viewProps
}) => {
  // TODO: This is for the pop-up component!
  /*
  const [plasticCollections, setPlasticCollections] = useState<
    PlasticCollection[]
  >([]);
  // TODO: Move this to useQueriedData
  const sharedAxiosConfig = useAxiosConfig();
  const fetchPlasticCollections = useCallback(() => {
    axios
      .get("/GetPlasticCollections", {
        params: { collectorId: userId, clusterId },
        ...sharedAxiosConfig,
      })
      .then((axiosResult) => {
        const { data } = axiosResult;
        setPlasticCollections(data);
      });
  }, [sharedAxiosConfig, userId]);

  useEffect(() => {
    fetchPlasticCollections();
  }, [fetchPlasticCollections]);
   */

  const { data: userProgressData, isLoading: userProgressDataIsLoading } =
    useQueriedData<ProgressionData>("/GetUserProgressData", {
      userId,
      clusterId,
    });
  const { data: clusterProgressData, isLoading: clusterProgressDataIsLoading } =
    useQueriedData<ProgressionData>("/GetClusterProgressData", {
      clusterId,
    });

  return (
    <View style={style} {...viewProps}>
      <View style={[{ flexDirection: "row" }]}>
        {userProgressData ? (
          <ProgressionCircle
            progressData={userProgressData}
            explanationText="Your share"
            isLoading={userProgressDataIsLoading}
          />
        ) : null}
        {clusterProgressData ? (
          <ProgressionCircle
            progressData={clusterProgressData}
            explanationText="Total share"
            isLoading={clusterProgressDataIsLoading}
          />
        ) : null}
      </View>
      <View style={styles.textContainer}>
        <AppText
          text="You have already collected dia volut et
          vel is sandanimus coreptur."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 70,
  },
});

export default CollectorProgression;
