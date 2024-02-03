import type { RegisterEngineer } from '../commands';
import type { Engineer } from '../engineer';
import type { Repository } from '../ports/output/repository';

export async function registerEngineer(
    repository: Repository<Engineer, string>,
    command: RegisterEngineer
): Promise<Engineer> {
    if (!isValidEmailAndName(command)) {
        throw new Error(`Cannot register user with invalid email and/or name`);
    }

    const engineerExists = await repository.getById(command.email);
    if (engineerExists) {
        throw new Error(`Cannot register ${command.email}. A user with that email already exists`);
    }

    return repository.save({ ...command, interestedProjects: [] }).then((engineer) => {
        console.log(`Registered new user ${command.email}`);
        return engineer;
    });
}

function isValidEmailAndName(command: RegisterEngineer) {
    // TODO: could implement some real email validation here...
    return command.email && command.name;
}
