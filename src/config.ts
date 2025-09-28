function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getOptionalEnv(name: string, defaultValue: string = ''): string {
  const value = process.env[name]
  return value && value.trim() !== '' ? value : defaultValue
}

export default {
  environment: () => getOptionalEnv('NODE_ENV', 'local'),
  port: () => parseInt(getRequiredEnv('PORT'), 10),
  databaseHost: () => getRequiredEnv('DATABASE_HOST'),
  databasePort: () => parseInt(getRequiredEnv('DATABASE_PORT')),
  databaseUser: () => getRequiredEnv('DATABASE_USER'),
  databasePassword: () => getRequiredEnv('DATABASE_PASSWORD'),
  databaseName: () => getRequiredEnv('DATABASE_NAME'),
  jwtSecret: () => getRequiredEnv('JWT_SECRET'),
}
