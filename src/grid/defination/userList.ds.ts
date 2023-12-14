import { ConfigObject, DataFieldInput, ValueType } from "realgrid";

export interface UserRow {
  name?: string;
  email?: string;
  age?: number;
  location?: string;
}

export const fields: DataFieldInput[] = [
  {
    fieldName: "name",
    dataType: ValueType.TEXT,
  },
  {
    fieldName: "email",
    dataType: ValueType.TEXT,
  },
  {
    fieldName: "age",
    dataType: ValueType.NUMBER,
  },
  {
    fieldName: "location",
    dataType: ValueType.TEXT,
  },
];

export const columns: (ConfigObject | string)[] = [
  {
    name: "name",
    fieldName: "name",
    type: "data",
    width: "80",
    styles: {
      textAlignment: "center",
    },
    header: {
      text: "이름",
      showTooltip: true,
      tooltip: '<span style="color: red;">이름</span>',
    },
    renderer: {
      type: "text",
      showTooltip: true,
    },
  },
  {
    name: "email",
    fieldName: "email",
    type: "data",
    width: "150",
    styles: {
      textAlignment: "center",
    },
    header: {
      text: "이메일",
      showTooltip: false,
    },
  },
  {
    name: "age",
    fieldName: "age",
    type: "data",
    width: "130",
    styles: {
      textAlignment: "center",
    },
    header: {
      text: "나이",
      showTooltip: false,
    },
    numberFormat: "0",
  },
  {
    name: "location",
    fieldName: "location",
    type: "data",
    width: "300",
    styles: {
      textAlignment: "center",
    },
    header: {
      text: "주소",
      showTooltip: false,
    },
  },
];
