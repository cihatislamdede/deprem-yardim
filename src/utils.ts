import { REGEX_PHONE_NUMBER, REGEX_PHONE_NUMBER_CLEANER } from "./constants";
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
  const isNumber = isPhoneNumber(phoneNumber);
  if (isNumber && isNumber.length) {
    return "(" + isNumber[1] + ") " + isNumber[2] + "-" + isNumber[3];
  }
  return null;
}

function isPhoneNumber(phoneNumber: string | undefined) {
  if (!phoneNumber) return false;
  phoneNumber = phoneNumber.replace(REGEX_PHONE_NUMBER_CLEANER, "");
  if (phoneNumber[0] === "+") {
    phoneNumber = phoneNumber.substring(3);
  }
  if (phoneNumber[0] === "0") {
    phoneNumber = phoneNumber.substring(1);
  }
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match;
}

function _findPhoneNumbers(value: string | undefined): string[] {
  if (!value) return [];
  let desc = value.replaceAll(REGEX_PHONE_NUMBER_CLEANER, '');
  const phoneNumbers = desc.match(REGEX_PHONE_NUMBER);
  if (phoneNumbers) {
    return Array.from(phoneNumbers);
  }
  return [];
}

function findPhoneNumbers(entry: Entry): Entry {
  entry.numbersInDesc = _findPhoneNumbers(entry.number);
  entry.numbersInDesc.push(..._findPhoneNumbers(entry.description));
  entry.numbersInDesc = Array.from(new Set(entry.numbersInDesc));
  return entry;
}

export { formatPhoneNumberView, filterEntries, findPhoneNumbers, isPhoneNumber };
