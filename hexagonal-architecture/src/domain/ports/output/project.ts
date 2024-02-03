import type { Project } from '../../project';

export interface ProjectApi {
    getRepoDetails(account: string, name: string): Promise<Project>;
}
