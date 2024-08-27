export interface RequestAvailableSlots {
    professional: {
        uid: string;
    };
    selectedDate: string;
    location: {
        lat: number;
        lng: number;
    };
}