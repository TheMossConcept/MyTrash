import axios from "axios";
import React, { FC, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ErrorMessage, useFormikContext } from "formik";
import axiosUtils from "../../utils/axios";
import { AccessTokenContext } from "../../navigation/TabNavigator";
import AutocompleteInput from "../inputs/AutocompleteInput";

type UserInputProps = {
  title?: string;
  usersEndpoint: string;
  stateKey:
    | "productionPartnerId"
    | "collectionAdministratorId"
    | "logisticsPartnerId"
    | "recipientPartnerId";
};

type Props = {};

const SelectPartnersForm: FC<Props> = () => {
  const [loading, setLoading] = useState(false);
  const accessToken = useContext(AccessTokenContext);

  const [userSelectionData, setUserSelectionData] = useState<UserInputProps[]>(
    []
  );
  useEffect(() => {
    if (accessToken) {
      axios
        .get("/GetAppRoles", {
          params: {
            code: "aWOynA5/NVsQKHbFKrMS5brpi5HtVZM3oaw4BEiIWDaHxAb0OdBi2Q==",
          },
          ...axiosUtils.getSharedAxiosConfig(accessToken),
        })
        .then((appRolesResult) => {
          const appRoles: any[] = appRolesResult.data;
          const localUserSelectionData = appRoles.map((appRole) => {
            const appRoleId = appRole.id;
            const appRoleValue = appRole.value;
            const title: string | undefined = appRole.displayName;

            const usersEndpoint = `/GetUsersByAppRole?appRoleId=${appRoleId}`;

            let stateKey;
            switch (appRoleValue) {
              case "ProductionPartner":
                stateKey = "productionPartnerId";
                break;
              case "CollectionAdministrator":
                stateKey = "collectionAdministratorId";
                break;
              case "LogisticsPartner":
                stateKey = "logisticsPartnerId";
                break;
              case "RecipientPartner":
                stateKey = "recipientPartnerId";
                break;
              default:
                console.warn("DEFAULT CASE IN CLUSTER CREATION FORM!!");
                break;
            }

            return stateKey
              ? {
                  title,
                  usersEndpoint,
                  stateKey,
                }
              : undefined;
          });

          const localUserSelectionDataRectified = localUserSelectionData.filter(
            (selectionData) => selectionData !== undefined
          ) as UserInputProps[];

          setUserSelectionData(localUserSelectionDataRectified);
        })
        .finally(() => setLoading(false));

      setLoading(true);
    }
  }, [accessToken]);

  const formikProps = useFormikContext<any>();

  if (!formikProps) {
    throw Error(
      "Incorrect use of select partners form. It's used outside a FormContainer which is not allowed as it needs the context crated by Formik!"
    );
  } else {
    const { values, setFieldValue, handleBlur } = formikProps;
    return (
      <View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          userSelectionData.map((selectionData, index) => {
            const userSelections = userSelectionData.length;
            const zIndex = userSelections - index;

            return (
              <View key={selectionData.title} style={{ width: "100%", zIndex }}>
                <AutocompleteInput
                  containerStyle={{ zIndex }}
                  selectionState={[
                    values[selectionData.stateKey],
                    (newValue: string) =>
                      setFieldValue(selectionData.stateKey, newValue),
                  ]}
                  endpoint={selectionData.usersEndpoint}
                  handleBlur={handleBlur(selectionData.stateKey)}
                  title={selectionData.title}
                />
                <ErrorMessage name={selectionData.stateKey} />
              </View>
            );
          })
        )}
      </View>
    );
  }
};

export default SelectPartnersForm;
