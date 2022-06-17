export function myConsoleLoading(text: any) {
  if (typeof text === "string") {
    console.log("⌛", text);
  } else {
    console.log("⌛", JSON.stringify(text));
  }
  return;
}
