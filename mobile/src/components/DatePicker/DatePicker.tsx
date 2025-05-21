import { useState } from "react";
import { TouchableOpacity, View, Text, Platform, Alert } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface DatePickerProps {
  onChange?: (event: DateTimePickerEvent, date?: Date) => void;
}

export default function DatePicker({ onChange }: DatePickerProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [mode, setMode] = useState<"date" | "time">("date");
  const [show, setShow] = useState(false);

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function isDateInPast(selectedDate: Date): boolean {
    const currentDate = new Date();

    if (mode === "date") {
      const selectedDateOnly = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      const currentDateOnly = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );

      return selectedDateOnly < currentDateOnly;
    } else if (mode === "time") {
      if (
        selectedDate.getDate() === currentDate.getDate() &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear()
      ) {
        return selectedDate < currentDate;
      }
    }

    return false;
  }

  function handleDateChange(
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    if (selectedDate) {
      if (isDateInPast(selectedDate)) {
        Alert.alert(
          "Data inválida",
          mode === "date"
            ? "A data selecionada não pode ser anterior à data atual."
            : "O horário selecionado não pode ser anterior ao horário atual."
        );

        if (mode === "time") {
          setShow(true);
        } else {
          setShow(false);
        }
        return;
      }

      const updatedDate = new Date(selectedDate);
      setDate(updatedDate);

      if (mode === "date") {
        setMode("time");
        setShow(true);
      } else {
        setShow(false);
        onChange && onChange(event, updatedDate);
      }
    }
  }

  function showPicker(mode: "date" | "time") {
    setShow(true);
    setMode(mode);
  }

  return (
    <>
      {show && (
        <DateTimePicker
          value={date}
          locale="pt-BR"
          mode={mode}
          is24Hour={true}
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
          minimumDate={mode === "date" ? new Date() : undefined}
        />
      )}
      <View>
        <TouchableOpacity onPress={() => showPicker("date")}>
          <View
            style={{
              width: "95%",
              height: 57,
              justifyContent: "center",
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              paddingLeft: 10,
            }}
          >
            <Text style={{ color: "#A1A1A1", fontSize: 16 }}>
              {formatDate(date)}{" "}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
