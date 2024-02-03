export enum HttpVerb {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export interface Route<T> {
    verb: HttpVerb;
    path: string;
    handler: T;
}

export interface WebServer<T> {
    addRoute(route: Route<T>): WebServer<T>;
    listen(port: number): void;
}
