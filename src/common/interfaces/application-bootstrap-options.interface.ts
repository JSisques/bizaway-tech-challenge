export interface ApplicationBootstrapOptions {
  driver: 'in-memory' | 'mongodb' | 'mysql' | 'postgresql' | 'sqlite';
  cache: 'in-memory' | 'redis' | 'noop';
}
