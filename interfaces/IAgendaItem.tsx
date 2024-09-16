export interface AgendaItem {
    choreId: number;
    name: string;
    height: number;
    day: string;
    isOverdue: boolean;
    assignedUser: string;
    deadline: undefined;
}