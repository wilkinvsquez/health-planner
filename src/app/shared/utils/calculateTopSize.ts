// Helper methods
export function calculateTop(start: Date) {
    const dayStartHour = 7;
    const startHour = start.getHours();
    const startMinute = start.getMinutes();
    const hourOffset = startHour - dayStartHour;
    const minuteOffset = startMinute / 60;
    const remPerHour = 4;
    const top = (hourOffset + minuteOffset) * remPerHour;
    return top;
}