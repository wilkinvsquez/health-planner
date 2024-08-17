export const convert12to24hour = (timeStr: string) => {
    const date = new Date(timeStr);
    const hours24 = date.getHours();
    return hours24;
}