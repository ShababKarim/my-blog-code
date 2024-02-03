import type { Engineer } from './engineer';

export function generateId(account: string, name: string) {
    return account.concat('/').concat(name);
}

export interface Project {
    id: string; // ID is account/name
    account: string;
    name: string;
    issues: Issue[];
}

export interface Issue {
    url: string; // ID
    title: string;
    description: string;
    reporter: string;
    assignedEngineer: Engineer | undefined;
    status: Status;
    lastUpdated: Date;
}

export enum Status {
    NOT_YET_STARTED = 'NOT YET STARTED',
    STARTED = 'STARTED',
    DONE = 'DONE',
    BLOCKED = 'BLOCKED',
}
