import type { Project } from '../../../project';
import type { Repository } from '../repository';

export class ProjectRepository implements Repository<Project, string> {
    projects: Project[];

    constructor() {
        this.projects = [];
    }

    getAll(): Promise<Project[]> {
        console.log('Retrieving all projects');
        return Promise.resolve(this.projects);
    }

    getById(id: string): Promise<Project | undefined> {
        console.log(`Retrieving repo by id ${id}`);
        return Promise.resolve(this.projects.findLast((repo) => repo.id === id));
    }

    save(entity: Project): Promise<Project> {
        this.projects = [...this.projects, entity];
        console.log(`Saved/updated repo with id ${entity.id}`);

        return Promise.resolve(entity);
    }

    saveAll(entities: Project[]): Promise<Project[]> {
        this.projects = [...this.projects, ...entities];
        console.log(`Saved/updated ${entities.length} repo(s)`);

        return Promise.resolve(entities);
    }
}
