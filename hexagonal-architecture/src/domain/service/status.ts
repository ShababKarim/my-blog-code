import type { UpdateIssueStatus } from '../commands';
import type { Repository } from '../ports/output/repository';
import { type Project } from '../project';

export async function updateIssueStatus(
    projectRepository: Repository<Project, string>,
    command: UpdateIssueStatus
): Promise<Project> {
    validateUpdateIssueStatusCommand(command);

    const projectWithUpdatedIssue = await updateProjectIssues(projectRepository, command);
    console.log(
        `Updated issue ${command.issueUrl} with status ${command.newStatus} for project ${projectWithUpdatedIssue.id}`
    );

    return projectRepository.save(projectWithUpdatedIssue);
}

function validateUpdateIssueStatusCommand(command: UpdateIssueStatus): void {
    if (!command.issueUrl || !command.projectId || !command.newStatus) {
        throw new Error('Cannot update issue status with invalid details');
    }
}

async function updateProjectIssues(
    projectRepository: Repository<Project, string>,
    command: UpdateIssueStatus
): Promise<Project> {
    const project = await projectRepository.getById(command.projectId);
    if (!project) {
        throw new Error(`Cannot update issue ${command.issueUrl} for project ${command.projectId}`);
    }

    return {
        ...project,
        issues: project.issues.map((issue) =>
            issue.url === command.issueUrl
                ? {
                      ...issue,
                      status: command.newStatus,
                  }
                : issue
        ),
    };
}
