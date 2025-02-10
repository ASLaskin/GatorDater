import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { users, preferences } from './server/schema'
import { v4 as uuidv4 } from 'uuid'

// Load environment variables
const connectionString = process.env.POSTGRES_URL
if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is not set')
}

console.log('Attempting to connect to PostgreSQL with connection string:', 
  connectionString.replace(/(:.*@)/,':*****@')) 

const queryClient = postgres(connectionString, {
  max: 1
})
const db = drizzle(queryClient, { schema: { users, preferences } })

const genders = ['male', 'female', 'non-binary'] as const
const possibleGenderPreferences = [
  '["male"]',
  '["female"]',
  '["non-binary"]',
  '["male","female"]',
  '["male","non-binary"]',
  '["female","non-binary"]',
  '["male","female","non-binary"]'
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Test the connection first
    await queryClient`SELECT 1`
    console.log('Database connection successful!')

    // Create 50 users
    for (let i = 1; i <= 50; i++) {
      const userId = uuidv4()
      const randomGender = genders[Math.floor(Math.random() * genders.length)]
      
      // Insert user
      await db.insert(users).values({
        id: userId,
        name: `Test User ${i}`,
        email: `testuser${i}@example.com`,
        bio: `I am user ${i}`,
        gender: randomGender,
        preferencesComplete: true,
        emailVerified: new Date(),
      })

      // Insert preferences
      await db.insert(preferences).values({
        id: uuidv4(),
        userId: userId,
        genderPreferences: possibleGenderPreferences[
          Math.floor(Math.random() * possibleGenderPreferences.length)
        ],
      })

      console.log(`✅ Created user ${i} with preferences`)
    }

    console.log('✨ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await queryClient.end()
  }
}

// Execute the seeding
seedDatabase()
  .catch((error) => {
    console.error('Failed to seed database:', error)
    process.exit(1)
  })