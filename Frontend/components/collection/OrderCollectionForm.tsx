import axios from "axios";
import React, { FC, useContext, useRef, useState } from "react";
import Popover from "react-native-popover-view";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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

  const [popoverIsShown, setPopoverIsShown] = useState(false);
  const popoverRef = useRef<TouchableOpacity>(null);

  const {
    update,
    loading,
    formValues,
    statusValues,
    refresh,
    collectionIsOver,
  } = useLatestPlasticCollection(userId);

  const sharedAxiosConfig = useAxiosConfig();

  const createCollectionRequest = (values: CollectionFormData) => {
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
      });
  };

  const dismissPopover = () => setPopoverIsShown(false);

  return collectionIsOver ? (
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
        onSubmit={(values) => {
          if (update && values) {
            update(values);
          } else if (values) {
            createCollectionRequest(values);
          }
        }}
        validateOnMount
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <SubmitButton
              title={update ? `Rediger \n afhentning.` : `Book \n afhentning.`}
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
              onPress={() => setPopoverIsShown(true)}
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
        <BooleanField
          label="Sidste opsamling"
          formKey="isLastCollection"
          style={[styles.inputField, styles.lastField]}
          enabled={!loading}
        />
      </FormContainer>
      {statusValues && (
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
    marginTop: 60,
    fontFamily: "HelveticaNeueLTPro-Hv",
    color: "#898c8e",
    fontSize: 32.5,
  },
  contentContainer: {
    marginTop: 20.5,
  },
  buttonsContainer: {
    marginTop: 24.25,
    height: 68,
    flexDirection: "row",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  button: {
    flex: 1,
  },
  inputField: {
    marginTop: 26.5,
  },
  lastField: {
    marginBottom: 15,
  },
});

export default CollectionForm;
