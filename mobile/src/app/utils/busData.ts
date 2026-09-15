import type { DimensionValue } from "react-native";

export type Bus = {
  line: string;
  name: string;
  eta: string;
  color: string;
  x: DimensionValue;
  y: DimensionValue;
};

// Dados simulados de linhas/ônibus (sem API real de localização).
export const BUSES: Bus[] = [
  {
    line: "302",
    name: "Terminal Central → FATEC",
    eta: "6 min",
    color: "#4b8b45",
    x: "25%",
    y: "37%",
  },
  {
    line: "118",
    name: "Jardim América → Centro",
    eta: "12 min",
    color: "#d78438",
    x: "62%",
    y: "58%",
  },
  {
    line: "406",
    name: "Regional → Rodoviária",
    eta: "18 min",
    color: "#4e76a8",
    x: "45%",
    y: "75%",
  },
];