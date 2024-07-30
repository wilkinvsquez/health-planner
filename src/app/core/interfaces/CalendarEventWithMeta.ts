import { CalendarEvent } from "angular-calendar";
import { Holiday } from "./Holiday";
import { Appointment } from "./Appointment";

export type CalendarEventWithMeta = CalendarEvent<{
    type: 'holiday';
    holiday: Holiday
} | {
    type: 'appointment';
    appointment: Appointment
}>;