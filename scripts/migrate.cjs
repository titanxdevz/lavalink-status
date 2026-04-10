const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    if (!process.env.MONGODB_URI) {
        console.error('Please set MONGODB_URI in .env.local');
        process.exit(1);
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('lavalink-list');
        const collection = db.collection('nodes');

        const nodesPath = path.join(__dirname, '..', 'nodes.json');
        if (!fs.existsSync(nodesPath)) {
            console.error('nodes.json not found!');
            return;
        }

        const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
        console.log(`Found ${nodes.length} nodes in nodes.json`);

        // Clear existing nodes if you want a clean start, but insertMany is safer
        // await collection.deleteMany({}); 

        if (nodes.length > 0) {
            const result = await collection.insertMany(nodes);
            console.log(`Successfully migrated ${result.insertedCount} nodes to MongoDB`);
        } else {
            console.log('No nodes to migrate.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.close();
    }
}

migrate();
