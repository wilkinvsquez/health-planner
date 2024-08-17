export const convert24to12hour = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    console.log(`${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`);

    return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}