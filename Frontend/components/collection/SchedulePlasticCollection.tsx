import axios from "axios";
import { DateTime } from "luxon";
import React, { FC, useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import {
  CalendarDate,
  SingleChange,
} from "react-native-paper-dates/lib/typescript/src/Date/Calendar";
import useAxiosConfig from "../../hooks/useAxiosConfig";
import useQueriedData from "../../hooks/useQueriedData";
import GlobalSnackbarContext from "../../utils/globalContext";
import InformationField from "../styled/InformationField";
import LoadingIndicator from "../styled/LoadingIndicator";
import WebButton from "../styled/WebButton";
import { PlasticCollection } from "./PlasticCollectionsDetails";

type Props = {
  plasticCollectionId: string;
  plasticCollectionScheduledCallback: () => void;
};

const SchedulePlasticCollection: FC<Props> = ({
  plasticCollectionId,
  plasticCollectionScheduledCallback,
}) => {
  const showGlobalSnackbar = useContext(GlobalSnackbarContext);
  const [loading, setLoading] = useState(false);

  const {
    isLoading: existingCollectionLoading,
    refetch,
    data: plasticCollection,
  } = useQueriedData<PlasticCollection>("/GetPlasticCollection", {
    id: plasticCollectionId,
  });

  const [initialDate, setInitialDate] = useState<DateTime | undefined>(
    undefined
  );

  useEffect(() => {
    if (plasticCollection && plasticCollection.scheduledPickupDate) {
      const parsedDate = DateTime.fromJSDate(
        new Date(plasticCollection.scheduledPickupDate)
      );

      setDate(parsedDate);
      setInitialDate(parsedDate);
    }
  }, [plasticCollection]);

  const [date, setDate] = useState<DateTime | undefined>(undefined);

  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);

  const selectPickupDate = () => setDatePickerOpen(true);
  const selectPickupTime = () => setTimePickerOpen(true);

  const onDismissDate = () => setDatePickerOpen(false);
  const onDismissTime = () => setTimePickerOpen(false);

  const onConfirmDate: SingleChange = (params: { date: CalendarDate }) => {
    const { date: selectedDate } = params;

    if (selectedDate) {
      const selectedDateTime = DateTime.fromJSDate(selectedDate);
      setDate(selectedDateTime);
    }

    setDatePickerOpen(false);
  };
  const onConfirmTime = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    if (date) {
      const dateWithTime = DateTime.fromObject({
        ...date.toObject(),
        hour: hours,
        minute: minutes,
      });

      setDate(dateWithTime);
    }

    setTimePickerOpen(false);
  };

  const sharedAxiosConfig = useAxiosConfig();
  const schedule = () => {
    if (date) {
      setLoading(true);

      axios
        .post(
          "SchedulePlasticCollection",
          { pickupDate: date.toJSDate() },
          {
            ...sharedAxiosConfig,
            params: { collectionId: plasticCollectionId },
          }
        )
        .then(() => {
          showGlobalSnackbar("Afhentning planlagt");

          refetch();
          plasticCollectionScheduledCallback();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const dateSelectionString = date ? date.toFormat("dd.MM.yyyy") : "";
  const timeSelectionString =
    date?.minute && date?.hour ? date.toFormat("HH.mm") : "";

  const selectedDateTimeString = dateSelectionString
    ? `Afhentes: ${dateSelectionString} ${
        timeSelectionString ? "kl." : ""
      } ${timeSelectionString}`
    : "";

  const isLoadingExistingCollection =
    plasticCollectionId !== undefined && existingCollectionLoading;

  const dateHasChanged = date !== initialDate;

  return (
    <View>
      <View style={styles.selectPickupDateTimeContainer}>
        {isLoadingExistingCollection && <LoadingIndicator />}
        {date !== undefined && (
          <View style={styles.dateStringInformationFieldContainer}>
            <InformationField value={selectedDateTimeString} />
          </View>
        )}
        <View
          style={[
            { flex: 1 },
            date !== undefined ? { marginLeft: 12 } : { marginLeft: 0 },
          ]}
        >
          <WebButton
            text="Vælg dato"
            onPress={selectPickupDate}
            disabled={isLoadingExistingCollection}
            icon={{
              src: require("../../assets/icons/calendar_grey.png"),
              width: 25,
              height: 25,
            }}
          />
        </View>
        <View style={styles.selectTimeButton}>
          <WebButton
            text="Vælg tid"
            onPress={selectPickupTime}
            disabled={date === undefined || isLoadingExistingCollection}
            icon={{
              src: require("../../assets/icons/calendar_grey.png"),
              width: 25,
              height: 25,
            }}
          />
        </View>
        <DatePickerModal
          mode="single"
          visible={datePickerOpen}
          onDismiss={onDismissDate}
          date={date?.toJSDate()}
          onConfirm={onConfirmDate}
          validRange={{
            startDate: new Date(),
          }}
          label="Vælg afhentningsdato" // optional, default 'Select time'
          // cancelLabel="Annuller" // optional, default: 'Cancel'
          // confirmLabel="Vælg" // optional, default: 'Ok'
          animationType="fade" // optional, default is 'none'
        />
        <TimePickerModal
          visible={timePickerOpen}
          onDismiss={onDismissTime}
          onConfirm={onConfirmTime}
          label="Vælg afhentningstidspunkt" // optional, default 'Select time'
          cancelLabel="Annuller" // optional, default: 'Cancel'
          confirmLabel="Vælg" // optional, default: 'Ok'
          animationType="fade" // optional, default is 'none'
        />
      </View>
      {loading && <LoadingIndicator />}
      <WebButton
        text="Planlæg."
        disabled={date === undefined || !dateHasChanged || loading}
        onPress={schedule}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectPickupDateTimeContainer: {
    flexDirection: "row",
    marginBottom: 23,
  },
  selectTimeButton: {
    flex: 1,
    marginLeft: 12,
  },
  dateStringInformationFieldContainer: {
    flex: 2,
  },
});

export default SchedulePlasticCollection;
