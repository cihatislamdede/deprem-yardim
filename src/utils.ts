import { REGEX_PHONE_NUMBER_CLEANER } from "./constants";
import { Entry } from "./model";

function filterEntries(
  filter: { city: string; district: string; search: string },
  entry: Entry
): boolean {
  let predicate = true;
  if (filter.city !== "" && filter.district === "") {
    predicate = predicate && entry.city === filter.city;
  } else if (filter.city !== "" && filter.district !== "") {
    predicate =
      predicate &&
      entry.city === filter.city &&
      entry.district === filter.district;
  }

  if (filter.search) {
    const query = [
      entry.city,
      entry.district,
      entry.description,
      entry.number,
      entry.numbersInDesc.join(' ')
    ].join(" ");
    predicate =
      predicate &&
      query.toLocaleLowerCase().includes(filter.search.toLocaleLowerCase());
  }
  return predicate;
}

// format telephone number to (xxx) xxx-xxxx
function formatPhoneNumberView(phoneNumber: string) {
  phoneNumber = phoneNumber.replace(REGEX_PHONE_NUMBER_CLEANER, "");
  if (phoneNumber[0] === "+") {
    phoneNumber = phoneNumber.substring(3);
  }
  if (phoneNumber[0] === "0") {
    phoneNumber = phoneNumber.substring(1);
  }
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

function fixPhoneNumber(entry: Entry): Entry {
  if (entry.number) {
    entry.number = entry.number.replaceAll(REGEX_PHONE_NUMBER_CLEANER, '');
    if (entry.number[0] === "+") {
      entry.number = entry.number.substring(3);
    }
    if (entry.number[0] === "0") {
      entry.number = entry.number.substring(1);
    }
  }
  return entry;
}

function findPhoneNumbersInDescription(entry: Entry): Entry {
  const phoneNumberRegex = /(5\d{9})/g;
  let desc = entry.description.replaceAll(REGEX_PHONE_NUMBER_CLEANER, '');
  const phoneNumbers = Array.from(new Set(desc.match(phoneNumberRegex)));
  if (phoneNumbers) {
    entry.numbersInDesc = phoneNumbers;
  }
  if (entry.number && phoneNumbers.includes(entry.number)) {
    entry.number = '';
  }
  return entry;
}

export { formatPhoneNumberView, filterEntries, findPhoneNumbersInDescription, fixPhoneNumber };
