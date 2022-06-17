export function myConsoleInfo(text: any) {
  if (typeof text === "string") {
    console.log("ℹ", text);
  } else {
    console.log("ℹ️", JSON.stringify(text));
  }
  return;
}
