// Helper methods
export function calculateTop(start: Date, dayStartHour: number) {
    const dayStart = dayStartHour;
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const hourOffset = startHour - dayStart;
    const minuteOffset = startMinute / 60;
    const remPerHour = 4;
    const top = (hourOffset + minuteOffset) * remPerHour;
    return top;
}