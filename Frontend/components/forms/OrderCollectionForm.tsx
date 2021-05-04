import axios from "axios";
import { ErrorMessage, Formik } from "formik";
import React, { FC, useState } from "react";
// TODO: Fix it so that we use buttons from react-native-paper instead
import { Button, Text } from "react-native";
import * as yup from "yup";
import { Checkbox, TextInput } from "react-native-paper";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import Container from "../shared/Container";
import DismissableSnackbar from "../shared/DismissableSnackbar";

type CollectionFormData = {
  numberOfUnits?: number;
  comment?: string;
  isLastCollection: boolean;
};

type Props = {
  userId: string;
  clusterId: string;
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
const CollectionForm: FC<Props> = ({ userId, clusterId }) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const initialValues: CollectionFormData = { isLastCollection: false };

  const accessToken = useAccessToken();
  const createCollectionRequest = (
    values: CollectionFormData,
    reset: () => void
  ) => {
    axios
      .post(
        "/CreatePlasticCollection",
        { clusterId, requesterId: userId, ...values },
        { ...axiosUtils.getSharedAxiosConfig(accessToken) }
      )
      .then(() => {
        reset();
        setShowSuccessSnackbar(true);
      });
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={(values, formikHelpers) =>
        createCollectionRequest(values, formikHelpers.resetForm)
      }
      validateOnMount
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        values,
        isValid,
        isSubmitting,
      }) => (
        <Container>
          <TextInput
            label="Antal enheder"
            value={values.numberOfUnits?.toString()}
            onChangeText={handleChange("numberOfUnits")}
            onBlur={handleBlur("numberOfUnits")}
          />
          <ErrorMessage name="numberOfUnits" />
          <TextInput
            label="Kommentar"
            value={values.comment}
            onChangeText={handleChange("comment")}
            onBlur={handleBlur("comment")}
          />
          <ErrorMessage name="comment" />
          <Text>Sidste opsamling</Text>
          <Checkbox
            status={values.isLastCollection ? "checked" : "unchecked"}
            onPress={() =>
              setFieldValue("isLastCollection", !values.isLastCollection)
            }
          />
          <Button
            title="Bestil afhentning"
            disabled={!isValid || isSubmitting}
            onPress={() => handleSubmit()}
          />
          <DismissableSnackbar
            title="Afhentning bestilt"
            showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
          />
        </Container>
      )}
    </Formik>
  );
};

export default CollectionForm;
