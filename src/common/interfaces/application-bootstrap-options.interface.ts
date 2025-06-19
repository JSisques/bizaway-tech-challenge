export interface ApplicationBootstrapOptions {
  driver: 'in-memory' | 'type-orm';
  cache: 'in-memory' | 'redis' | 'noop';
}
