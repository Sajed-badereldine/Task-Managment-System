import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Explicitly point to the .env file in the current working directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

console.log("🔍 Checking Environment Variables for Database Sync:");
console.log(`   - DIRECT_URL: ${process.env.DIRECT_URL ? '✅ Found direct connection string' : '❌ Missing'}`);

if (!process.env.DIRECT_URL) {
  console.error("❌ Error: DIRECT_URL environment variable is missing from your .env file.");
  process.exit(1);
}

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DIRECT_URL, // Target the unpooled direct connection
  entities: [User, Task],
  synchronize: true,           // Safely forces table generation
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source successfully initialized via Direct Connection.");
    console.log("✅ Production tables have been synced to Neon!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
    process.exit(1);
  });