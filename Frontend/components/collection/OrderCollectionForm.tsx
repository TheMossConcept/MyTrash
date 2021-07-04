import axios from "axios";
import React, { FC, useContext, useRef, useState } from "react";
import Popover from "react-native-popover-view";
import { Text, View } from "react-native";
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
import Button from "../styled/Button";

type CollectionFormData = {
  numberOfUnits?: number;
  comment?: string;
  isLastCollection: boolean;
};

type Props = {
  userId: string;
  clusterId: string;
  successCallback: () => void;
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
  const initialValues: CollectionFormData = {
    isLastCollection: false,
    comment: "",
  };

  const [popoverIsShown, setPopoverIsShown] = useState(false);
  const popoverRef = useRef<TouchableOpacity>();

  const sharedAxiosConfig = useAxiosConfig();
  const createCollectionRequest = (
    values: CollectionFormData,
    reset: () => void
  ) => {
    axios
      .post(
        "/CreatePlasticCollection",
        { clusterId, requesterId: userId, ...values },
        { ...sharedAxiosConfig }
      )
      .then(() => {
        showGlobalSnackbar("Afhentning bestilt");
        reset();

        successCallback();
      });
  };

  return (
    <View>
      <Text
        style={{
          marginTop: 70,
          fontFamily: "HelveticaNeueLTPro-Hv",
          color: "#898c8e",
          fontSize: 32.5,
        }}
      >
        Book afhentninger.
      </Text>
      <FormContainer
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          createCollectionRequest(values, formikHelpers.resetForm);
        }}
        validateOnMount
        style={{ marginTop: 40.5 }}
      >
        <NumberField label="Antal enheder" formKey="numberOfUnits" />
        <StringField
          label="Kommentar"
          formKey="comment"
          style={{ marginTop: 26.5 }}
        />
        <BooleanField
          label="Sidste opsamling"
          formKey="isLastCollection"
          style={{ marginTop: 26.5 }}
        />
        <View style={{ marginTop: 58.5, height: 68, flexDirection: "row" }}>
          <SubmitButton
            title={`Book \n afhentning.`}
            style={{ flex: 1, marginRight: 7.5 }}
            icon={{
              src: require("../../assets/icons/calendar_grey.png"),
              width: 28,
              height: 27.5,
            }}
          />
          <Button
            text={`Status på \n afhentning.`}
            ref={popoverRef}
            onPress={() => setPopoverIsShown(true)}
            isVerticalButton
            style={{ flex: 1 }}
            icon={{
              src: require("../../assets/icons/notepad_grey.png"),
              height: 30,
              width: 33,
            }}
          />
        </View>
      </FormContainer>
      <Popover
        from={popoverRef}
        isVisible={popoverIsShown}
        onRequestClose={() => setPopoverIsShown(false)}
      >
        <Text>This is a test of the popover</Text>
      </Popover>
    </View>
  );
};

export default CollectionForm;
