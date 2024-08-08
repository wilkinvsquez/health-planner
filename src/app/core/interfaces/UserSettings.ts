import { NurseSchedule } from './NurseSchedule';

export interface UserSettings {
    maxDistance: number;
    schedule: NurseSchedule;
    lunchTime: string;
}
