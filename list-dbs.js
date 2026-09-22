// list-dbs.js
const { MongoClient } = require('mongodb');

const URI = 'mongodb+srv://bijay_db_user:yiZhePXAQC1cKhi8@ib.vu5bsia.mongodb.net/?appName=IB';

async function main() {
    const client = new MongoClient(URI);
    await client.connect();

    const admin = client.db().admin();
    const { databases } = await admin.listDatabases();

    console.log('📂 Databases on this cluster:\n');

    for (const d of databases) {
        console.log(`▸ ${d.name}  (size: ${(d.sizeOnDisk / 1024).toFixed(1)} KB)`);

        const db = client.db(d.name);
        const cols = await db.listCollections().toArray();
        console.log(`   collections: ${cols.map((c) => c.name).join(', ') || '(empty)'}\n`);
    }

    await client.close();
}

main().catch(console.error);
