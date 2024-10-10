const ormconfig = {
    type: 'mysql',
    host: 'localhost', //host.docker.internal
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'simplevoice',
    synchronize: true,
    logging: false,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber'
    }
}

const serverConfig = {
    defaultPort: 8777,
    defaultHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': '*'
    },
    subUrl: '/'
}

export { serverConfig, ormconfig }
