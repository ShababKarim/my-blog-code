import type { Status } from './project';

export interface RegisterEngineer {
    name: string;
    email: string;
}

export interface MatchEngineerToProject {
    account: string;
    name: string;
}

export interface UpdateIssueStatus {
    projectId: string;
    issueUrl: string;
    newStatus: Status;
}
