import type { MatchEngineerToProject } from '../commands';
import type { Engineer } from '../engineer';
import type { ProjectApi } from '../ports/output/project';
import type { Repository } from '../ports/output/repository';
import { generateId, type Project } from '../project';

export async function matchEngineerToProject(
    projectApi: ProjectApi,
    engineerRepository: Repository<Engineer, string>,
    projectRepository: Repository<Project, string>,
    command: MatchEngineerToProject
): Promise<Project> {
    validateMatchEngineerToProjectCommand(command);

    const project = await getOrUpdateProject(projectApi, projectRepository, command);
    const interestedEngineers = await getInterestedEngineers(engineerRepository, project.id);
    console.log(
        `Assigning ${project.issues.length} issue(s) across ${interestedEngineers.length} interested engineer(s) for project ${project.id}`
    );

    const projectWithAssignedIssues = assignIssuesToEngineers(project, interestedEngineers);
    console.log(
        `Assigned ${projectWithAssignedIssues.issues.length} issue(s) for project ${project.id}`
    );
    projectRepository.save(projectWithAssignedIssues);

    return projectWithAssignedIssues;
}

function validateMatchEngineerToProjectCommand(command: MatchEngineerToProject): void {
    if (!command.account || !command.name) {
        throw new Error('Cannot match for invalid project');
    }
}

async function getOrUpdateProject(
    projectApi: ProjectApi,
    projectRepository: Repository<Project, string>,
    command: MatchEngineerToProject
): Promise<Project> {
    // If the repo already exists within our db, we won't retrieve from the API
    // Obviously this would cause an issue of staleness of the data, but we're just demoing concepts
    const project = await projectRepository.getById(generateId(command.account, command.name));

    return project
        ? project
        : projectApi
              .getRepoDetails(command.account, command.name)
              .then((newRepo) => projectRepository.save(newRepo));
}

async function getInterestedEngineers(
    engineerRepository: Repository<Engineer, string>,
    projectId: string
): Promise<Engineer[]> {
    return await engineerRepository
        .getAll()
        .then((engineers) =>
            engineers.filter((engineer) => engineer.interestedProjects.includes(projectId))
        );
}

function assignIssuesToEngineers(project: Project, interestedEngineers: Engineer[]): Project {
    return {
        ...project,
        issues: project.issues
            .filter((issue) => !issue.assignedEngineer)
            .map((issue) => ({
                ...issue,
                assignedEngineer: findRandomEngineer(interestedEngineers),
            })),
    };
}

function findRandomEngineer(engineers: Engineer[]): Engineer {
    if (engineers.length < 1) {
        throw new Error('No available engineers to assign to issue');
    }

    return engineers[Math.floor(Math.random() * engineers.length)];
}
