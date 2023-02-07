import { Entry } from "./model";
function formatNumber(entry: Entry): Entry {
    let number = !entry.number ? 'bilinmiyor' : entry.number ;
    if(number == 'bilinmiyor'){
        return entry;
    }
    entry.number = fixNumber(number);
    return entry;
}

function fixNumber(number:string): string {
    number = number!.replaceAll(' ', '');
    if (number.startsWith('0')) {
        number = number.substring(1, number.length);
    }
    return number;
}

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
export {
    formatNumber,
    filterEntries
}