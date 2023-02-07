// format telephone number to (xxx) xxx-xxxx

export function formatPhoneNumber(phoneNumber: string) {
  phoneNumber = phoneNumber.replace(/[- )(]/g, "");
  if (phoneNumber[0] === "+") {
    phoneNumber = phoneNumber.substring(3);
  }
  if (phoneNumber[0] === "0") {
    phoneNumber = phoneNumber.substring(1);
  }
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match === null) {
    console.log(phoneNumber, cleaned, match);
  }
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}
