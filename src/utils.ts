import { Entry } from "./model";

function filterEntries(filter: { city: string, district: string, search: string }, entry: Entry): boolean {
    let predicate = true;
    if (filter.city !== "" && filter.district === "") {
        predicate = predicate && (entry.city === filter.city);
    } else if (filter.city !== "" && filter.district !== "") {
        predicate = predicate && (
            entry.city === filter.city &&
            entry.district === filter.district
        );
    }

    if (filter.search) {
        const query = [entry.city, entry.district, entry.description, entry.number].join(' ');
        predicate = predicate && query.toLocaleLowerCase().includes(filter.search.toLocaleLowerCase());
    }
    return predicate;
}

// format telephone number to (xxx) xxx-xxxx
function formatPhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/[- )(]/g, "");
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

export {
    formatPhoneNumber,
    filterEntries
}