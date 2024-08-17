import { convert24to12hour } from "./conver24to12hour";

export const getTimeFromDatetime = (datetime: string) => {
    if (datetime.includes(',')) {
        convert24to12hour(datetime.split(',')[1])
        // console.log(datetime.split(',')[1]);

        return Number(datetime.split(',')[1].split(':')[0]);
    }

    return 1
    // return Number(datetime.split(',')[1].split(':')[0]);
};