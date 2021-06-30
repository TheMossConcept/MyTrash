import React, { FC } from "react";
import { View } from "react-native";
import useQueriedData from "../../hooks/useQueriedData";
import ProgressionCircle, { ProgressionData } from "./ProgressionCircle";

type ClusterViewForCollectorProps = {
  userId: string;
  clusterId: string;
};

const CollectorProgression: FC<ClusterViewForCollectorProps> = ({
  userId,
  clusterId,
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
    <View>
      {userProgressData ? (
        <ProgressionCircle
          headline="Personlig indsamlingsfremgang"
          progressData={userProgressData}
          isLoading={userProgressDataIsLoading}
        />
      ) : null}
      {clusterProgressData ? (
        <ProgressionCircle
          headline="Cirklens samlede indsamlingsfremgang"
          progressData={clusterProgressData}
          isLoading={clusterProgressDataIsLoading}
        />
      ) : null}
    </View>
  );
};

export default CollectorProgression;
