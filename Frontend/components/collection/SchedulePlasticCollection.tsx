import axios from "axios";
import { DateTime } from "luxon";
import React, { FC, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";
import DismissableSnackbar from "../shared/DismissableSnackbar";

type Props = {
  plasticCollectionId: string;
  plasticCollectionScheduledCallback: () => void;
};

const SchedulePlasticCollection: FC<Props> = ({
  plasticCollectionId,
  plasticCollectionScheduledCallback,
}) => {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(true);

  const [date, setDate] = useState<DateTime | undefined>(undefined);
  const [timeIsSet, setTimeIsSet] = useState(false);

  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);

  const selectPickupDate = () => setDatePickerOpen(true);
  const selectPickupTime = () => setTimePickerOpen(true);

  const onDismissDate = () => setDatePickerOpen(false);
  const onDismissTime = () => setTimePickerOpen(false);

  // TODO: Fix these typings so they come from the library itself!
  const onConfirmDate = (params: { date: Date }) => {
    const { date: selectedDate } = params;
    if (selectedDate) {
      setDate(DateTime.fromJSDate(selectedDate));
    }

    setDatePickerOpen(false);
  };
  const onConfirmTime = ({
    hours,
    minutes,
  }: // TODO: Fix these typings so they come from the library itself!
  {
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
      setTimeIsSet(true);
    }

    setTimePickerOpen(false);
  };

  const accessToken = useAccessToken();
  const schedule = () => {
    if (date) {
      axios
        .post(
          "SchedulePlasticCollection",
          { pickupDate: date.toJSDate() },
          {
            ...axiosUtils.getSharedAxiosConfig(accessToken),
            params: { collectionId: plasticCollectionId },
          }
        )
        .then(() => {
          setShowSuccessSnackbar(true);
        });
    }
  };

  // Ensure that we don't refetch until the snackbar disappears
  useEffect(() => {
    // NB! This  will make a surpurflous call initially. Fix that!
    if (!showSuccessSnackbar) {
      plasticCollectionScheduledCallback();
    }
  }, [plasticCollectionScheduledCallback, showSuccessSnackbar]);

  const dateSelectionString = date
    ? date.toLocaleString({
        month: "long",
        day: "2-digit",
      })
    : "Ikke valgt";

  const timeSelectionString =
    date?.minute && date?.hour
      ? date.toLocaleString({
          minute: timeIsSet ? "2-digit" : undefined,
          hour: timeIsSet ? "2-digit" : undefined,
          hour12: false,
        })
      : "Tidspunkt ikke valgt";

  return (
    <View>
      <Text>
        Afhentningsdato{" "}
        <Button title={dateSelectionString} onPress={selectPickupDate} />
        {date && (
          <View style={styles.pickTimeBtn}>
            <Button title={timeSelectionString} onPress={selectPickupTime} />
          </View>
        )}
      </Text>
      <DatePickerModal
        mode="single"
        visible={datePickerOpen}
        onDismiss={onDismissDate}
        date={date?.toJSDate()}
        onConfirm={onConfirmDate}
        label="Vælg afhentningsdato" // optional, default 'Select time'
        cancelLabel="Annuller" // optional, default: 'Cancel'
        confirmLabel="Vælg" // optional, default: 'Ok'
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
      <View style={styles.submitBtn}>
        <Button title="Planlæg" onPress={schedule} disabled={!date} />
        <DismissableSnackbar
          title="Afhentning planlagt"
          showState={[showSuccessSnackbar, setShowSuccessSnackbar]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickTimeBtn: {
    marginLeft: 5,
  },
  submitBtn: {
    marginTop: 10,
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export default SchedulePlasticCollection;
