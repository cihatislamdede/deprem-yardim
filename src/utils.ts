import { Entry } from "./model";
function formatNumber(entry :Entry): Entry {
    let number = entry.number;
    if(number) {
        number = number.replaceAll(' ','');
        if(number.startsWith('0')) {
            number = number.substring(1, number.length);
        }
        if(number.length != 10) {
            number = number.padEnd(10, '*');
        }
        entry.number = number;
    } else {
        entry.number = '';
    }
    return entry;
}

export {
    formatNumber
}