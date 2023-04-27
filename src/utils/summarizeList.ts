export function summarizeList(listOfTexts: string[], maxLength: number) {
  if (listOfTexts.length === 0) {
    return "";
  }
  let summary = "";
  let remaining = listOfTexts.length;
  for (let i = 0; i < listOfTexts.length; i++) {
    const text = listOfTexts[i];
    if (text.length <= maxLength) {
      if (summary !== "") {
        summary += " and ";
      }
      summary += text;
    } else if (remaining > 3) {
      remaining--;
      continue;
    } else {
      const truncated = text.substring(0, maxLength - 3) + "..";
      if (summary !== "") {
        summary += ", ";
      }
      summary += truncated;
    }
  }
  if (remaining > 3) {
    summary += " and " + (remaining - 3) + " others";
  }
  return summary;
}
