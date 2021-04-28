import React, { FC } from "react";
import { Button, Text, View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

type Props = { plasticCollectionId: string };

const SchedulePlasticCollection: FC<Props> = () => {
  // TODO: FIX LUXON!
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);

  const selectPickupDate = () => setOpen(true);

  const onDismissSingle = () => {
    setOpen(false);
  };

  const onConfirmSingle = (params: any) => {
    setOpen(false);
    setDate(params.date);
  };

  const schedule = () => {
    console.log("Not implemented");
    // TODO: Do the call to schedule the pick-up at the specified date!
  };

  return (
    <View>
      <Text>Planlæg afhentning</Text>
      <Text>Afhentningsdato: {date ? date.toString() : "Ikke valgt"}</Text>
      <Button title="Vælg afhentningsdato" onPress={selectPickupDate} />
      <DatePickerModal
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />
      <Button title="Planlæg" onPress={schedule} />
    </View>
  );
};

export default SchedulePlasticCollection;
