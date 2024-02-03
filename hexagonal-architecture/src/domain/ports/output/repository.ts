export interface Repository<T, V> {
    getAll(): Promise<T[]>;
    getById(id: V): Promise<T | undefined>;
    save(entity: T): Promise<T>;
    saveAll(entities: T[]): Promise<T[]>;
}
