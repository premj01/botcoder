export interface Message {
  from: "user" | "ai";
  text: string;
}
