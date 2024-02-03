import { Status, type Project, generateId } from '../../../project';
import type { ProjectApi } from '../project';

// const REPO_API = 'https://api.github.com/repos/{0}/{1}';
const ISSUES_API = 'https://api.github.com/repos/{0}/{1}/issues';

// Github calls a project a repo because in Github's business domain, that's exactly what it is
// In my application, I call it a project because
// 1. I am agnostic to whether that is a code repository - therefore the source of this info doesn't matter
// 2. I already define a repo as a data store, therefore I need to be nuanced about letting 2 different
// components share the same name
export class GithubProjectApi implements ProjectApi {
    async getRepoDetails(account: string, name: string): Promise<Project> {
        if (this.isInvalidAccountAndRepo(account, name)) {
            throw new Error('Cannot retrieve project with invalid account and/or repo name');
        }

        const issuesList = await fetch(this.generateApiUrl(ISSUES_API, account, name)).then(
            (res) => res.json() as any
        );
        console.log(
            `Retrieved ${issuesList?.length} issue(s) for account/repo: ${account}/${name}`
        );

        return {
            id: generateId(account, name),
            account,
            name,
            issues: issuesList.map((issue: any) => ({
                url: issue?.url,
                title: issue?.title,
                description: issue?.body,
                reporter: issue?.user?.login,
                assignedEngineer: null,
                status: Status.NOT_YET_STARTED,
                lastUpdated: issue?.updated_at,
            })),
        };
    }

    private isInvalidAccountAndRepo(account: string, repo: string): boolean {
        return !(!!account && !!repo);
    }

    private generateApiUrl(apiUrlTemplate: string, account: string, repo: string): string {
        return apiUrlTemplate.replace('{0}', account).replace('{1}', repo);
    }
}
