import axios from "axios";
import { DateTime } from "luxon";
import React, { FC, useState } from "react";
import { Button, Text, View } from "react-native";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import axiosUtils from "../../utils/axios";
import useAccessToken from "../../hooks/useAccessToken";

type Props = { plasticCollectionId: string };

const SchedulePlasticCollection: FC<Props> = ({ plasticCollectionId }) => {
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
      axios.post(
        "SchedulePlasticCollection",
        { pickupDate: date.toJSDate() },
        {
          ...axiosUtils.getSharedAxiosConfig(accessToken),
          params: { collectionId: plasticCollectionId },
        }
      );
    }
  };

  return (
    <View>
      <Text>Planlæg afhentning</Text>
      <Text>
        Afhentningsdato:{" "}
        {date
          ? date.toLocaleString({
              month: "long",
              day: "2-digit",
              minute: timeIsSet ? "2-digit" : undefined,
              hour: timeIsSet ? "2-digit" : undefined,
              hour12: false,
            })
          : "Ikke valgt"}
      </Text>
      <Button title="Vælg afhentningsdato" onPress={selectPickupDate} />
      <Button
        title="Vælg afhentningstidspunkt"
        onPress={selectPickupTime}
        disabled={date === undefined}
      />
      <DatePickerModal
        mode="single"
        visible={datePickerOpen}
        onDismiss={onDismissDate}
        date={date?.toJSDate()}
        onConfirm={onConfirmDate}
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
      <Button title="Planlæg" onPress={schedule} />
    </View>
  );
};

export default SchedulePlasticCollection;
