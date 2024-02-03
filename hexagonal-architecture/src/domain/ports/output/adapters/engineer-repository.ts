import type { Engineer } from '../../../engineer';
import type { Repository } from '../repository';

export class EngineerRepository implements Repository<Engineer, string> {
    engineers: Engineer[];

    constructor() {
        this.engineers = [
            {
                email: 'bob@gmail.com',
                name: 'bob',
                interestedProjects: ['spring-projects/spring-boot', 'facebook/react-native'],
            },
            {
                email: 'alice@gmail.com',
                name: 'alice',
                interestedProjects: ['facebook/react-native'],
            },
        ];
    }

    getAll(): Promise<Engineer[]> {
        console.log('Retrieving all engineers');
        return Promise.resolve(this.engineers);
    }

    getById(id: string): Promise<Engineer | undefined> {
        console.log(`Retrieving engineer by id ${id}`);
        return Promise.resolve(this.engineers.findLast((engineer) => engineer.email === id));
    }

    save(entity: Engineer): Promise<Engineer> {
        this.engineers = [...this.engineers, entity];
        console.log(`Saved/updated engineer with id ${entity.email}`);

        return Promise.resolve(entity);
    }

    saveAll(entities: Engineer[]): Promise<Engineer[]> {
        this.engineers = [...this.engineers, ...entities];
        console.log(`Saved/updated ${entities.length} engineer(s)`);

        return Promise.resolve(entities);
    }
}
