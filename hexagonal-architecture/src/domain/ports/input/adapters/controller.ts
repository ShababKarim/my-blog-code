import { Elysia, type Handler } from 'elysia';

import { type WebServer, type Route, HttpVerb } from '../web';
import { registerEngineer } from '../../../service/register';
import { EngineerRepository } from '../../output/adapters/engineer-repository';
import type {
    MatchEngineerToProject,
    RegisterEngineer,
    UpdateIssueStatus,
} from '../../../commands';
import { GithubProjectApi } from '../../output/adapters/github-project-api';
import { ProjectRepository } from '../../output/adapters/project-repository';
import { matchEngineerToProject } from '../../../service/assignment';
import { updateIssueStatus } from '../../../service/status';

class ElysiaServer implements WebServer<Handler> {
    app: Elysia;

    constructor() {
        this.app = new Elysia().onError(({ error }) => {
            console.log(`Request failed with cause: ${error.stack}`);
            return new Response(error.toString());
        });
    }

    addRoute(route: Route<Handler>): WebServer<Handler> {
        if (route.verb == HttpVerb.DELETE) {
            this.app.delete(route.path, route.handler);
        } else if (route.verb == HttpVerb.PUT) {
            this.app.put(route.path, route.handler);
        } else if (route.verb == HttpVerb.POST) {
            this.app.post(route.path, route.handler);
        } else {
            this.app.get(route.path, route.handler);
        }

        return this;
    }

    listen(port: number): void {
        console.log(`Starting server on port ${port}...`);
        this.app.listen(port);
    }
}

export function startApp(port: number) {
    const engineerRepository = new EngineerRepository();
    const projectRepository = new ProjectRepository();
    const projectApi = new GithubProjectApi();

    new ElysiaServer()
        .addRoute({
            verb: HttpVerb.POST,
            path: '/register',
            handler: async ({ body }) => {
                return await registerEngineer(engineerRepository, body as RegisterEngineer);
            },
        })
        .addRoute({
            verb: HttpVerb.POST,
            path: '/assign',
            handler: async ({ body }) => {
                return await matchEngineerToProject(
                    projectApi,
                    engineerRepository,
                    projectRepository,
                    body as MatchEngineerToProject
                );
            },
        })
        .addRoute({
            verb: HttpVerb.POST,
            path: '/update',
            handler: async ({ body }) => {
                return await updateIssueStatus(projectRepository, body as UpdateIssueStatus);
            },
        })
        .listen(port);
}
