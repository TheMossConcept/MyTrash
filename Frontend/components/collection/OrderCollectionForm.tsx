import axios from "axios";
import React, { FC, useContext, useRef, useState } from "react";
import Popover from "react-native-popover-view";
import { StyleSheet, Text, View } from "react-native";
// TODO: Fix it so that we use buttons from react-native-paper instead
import * as yup from "yup";
import { TouchableOpacity } from "react-native-gesture-handler";
import FormContainer from "../shared/FormContainer";
import StringField from "../inputs/StringField";
import BooleanField from "../inputs/BooleanField";
import NumberField from "../inputs/NumberField";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import GlobalSnackbarContext from "../../utils/globalContext";
import SubmitButton from "../inputs/SubmitButton";
import MobileButton from "../styled/MobileButton";
import CollectionStatusPopover from "./CollectionStatusPopover";
import useLatestPlasticCollection from "../../hooks/useLatestPlasticCollection";
import LoadingIndicator from "../styled/LoadingIndicator";

export type CollectionFormData = {
  numberOfUnits?: number;
  comment?: string;
  isLastCollection: boolean;
};

type Props = {
  userId: string;
  clusterId: string;
  successCallback?: () => void;
};

const validationSchema = yup.object().shape({
  numberOfUnits: yup
    .number()
    .min(1, "Der skal minimum være en enhed")
    .required("Antal enheder er påkrævet"),
  comment: yup.string().optional(),
  isLastCollection: yup.boolean().optional(),
});

// TODO: Change undefined to null to get rid of the controlled to uncontrolled error!
const CollectionForm: FC<Props> = ({ userId, clusterId, successCallback }) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);

  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isUpdatingCollection, setIsUpdatingCollection] = useState(false);

  const [popoverIsShown, setPopoverIsShown] = useState(false);
  const popoverRef = useRef<TouchableOpacity>(null);

  const {
    update,
    formValues,
    loading: isFetchingData,
    statusValues,
    refresh,
    collectionIsOver,
  } = useLatestPlasticCollection(userId);

  const showCollectionStatusPopover = () => {
    refresh();
    setPopoverIsShown(true);
  };

  const loading =
    isCreatingCollection || isUpdatingCollection || isFetchingData;

  const sharedAxiosConfig = useAxiosConfig();

  const createCollectionRequest = (values: CollectionFormData) => {
    setIsCreatingCollection(true);

    axios
      .post(
        "/CreatePlasticCollection",
        { clusterId, requesterId: userId, ...values },
        { ...sharedAxiosConfig }
      )
      .then(() => {
        refresh();

        showGlobalSnackbar("Afhentning bestilt");

        if (successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        console.log(error);
        refresh();
      })
      .finally(() => {
        setIsCreatingCollection(false);
      });
  };

  const dismissPopover = () => setPopoverIsShown(false);

  return collectionIsOver === true ? (
    <View>
      <Text style={styles.headlineText}>Indsamlingen er overstået</Text>
      {statusValues && (
        <CollectionStatusPopover
          style={styles.contentContainer}
          dismissPopover={dismissPopover}
          data={statusValues}
        />
      )}
    </View>
  ) : (
    <View>
      <Text style={styles.headlineText}>Book afhentning.</Text>
      <FormContainer
        initialValues={formValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (update) {
            setIsUpdatingCollection(true);

            update(values).finally(() => {
              setIsUpdatingCollection(false);
            });
          } else {
            createCollectionRequest(values);
          }
        }}
        validateOnMount
        enableReinitialize
        style={styles.contentContainer}
      >
        <NumberField
          label="Antal enheder"
          formKey="numberOfUnits"
          editable={!loading}
        />
        <StringField
          label="Kommentar"
          formKey="comment"
          maxLength={140}
          editable={!loading}
          style={styles.inputField}
        />
        <BooleanField
          label="Sidste opsamling"
          formKey="isLastCollection"
          enabled={!loading}
          style={styles.inputField}
        />
        {loading ? (
          <LoadingIndicator />
        ) : (
          <View style={styles.buttonsContainer}>
            <SubmitButton
              title={update ? `Ret \n afhentning` : `Book \n afhentning.`}
              style={[styles.button, { marginRight: 7.5 }]}
              icon={{
                src: require("../../assets/icons/calendar_grey.png"),
                width: 28,
                height: 27.5,
              }}
            />
            <MobileButton
              text={`Status på \n afhentning.`}
              ref={popoverRef}
              onPress={showCollectionStatusPopover}
              disabled={!statusValues}
              isVerticalButton
              style={styles.button}
              icon={{
                src: require("../../assets/icons/notepad_grey.png"),
                height: 30,
                width: 33,
              }}
            />
          </View>
        )}
      </FormContainer>
      {statusValues !== undefined && (
        <Popover
          from={popoverRef}
          isVisible={popoverIsShown}
          onRequestClose={dismissPopover}
        >
          <CollectionStatusPopover
            dismissPopover={dismissPopover}
            data={statusValues}
          />
        </Popover>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headlineText: {
    marginTop: 70,
    fontFamily: "HelveticaNeueLTPro-Hv",
    color: "#898c8e",
    fontSize: 32.5,
  },
  contentContainer: {
    marginTop: 40.5,
  },
  buttonsContainer: {
    marginTop: 20,
    marginBottom: 20,
    height: 68,
    flexDirection: "row",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
  inputField: {
    marginTop: 26.5,
  },
});

export default CollectionForm;
