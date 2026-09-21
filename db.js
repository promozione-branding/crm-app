// db.js
// Run with: node db.js

const { MongoClient, ObjectId } = require('mongodb');

const URI = 'mongodb+srv://bijay_db_user:yiZhePXAQC1cKhi8@ib.vu5bsia.mongodb.net/?appName=IB';
const DB_NAME = 'test';

async function main() {
    const client = new MongoClient(URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        console.log(`✅ Connected to database: ${db.databaseName}\n`);

        // =====================================================
        // 1. ROLES
        // =====================================================
        console.log('═══════════════════════════════════════════');
        console.log(' 1. ROLES');
        console.log('═══════════════════════════════════════════');

        const roles = await db.collection('roles').find({}).toArray();

        for (const role of roles) {
            console.log(`\n▸ Role: ${role.name}`);
            console.log(`  _id:          ${role._id}`);
            console.log(`  isSystemRole: ${role.isSystemRole}`);
            console.log(`  companyId:    ${role.companyId}`);

            const taskPerm = (role.permissions || []).find((p) => p.module === 'tasks');

            if (taskPerm) {
                console.log(`  ✅ tasks permission:`);
                console.log(`     actions: [${taskPerm.actions.join(', ')}]`);
                console.log(`     scope:   ${taskPerm.scope}`);
            } else {
                console.log(`  ❌ NO tasks permission on this role!`);
            }
        }

        // =====================================================
        // 2. COMPANIES
        // =====================================================
        console.log('\n═══════════════════════════════════════════');
        console.log(' 2. COMPANIES');
        console.log('═══════════════════════════════════════════');

        const companies = await db.collection('companies').find({}).toArray();

        for (const c of companies) {
            console.log(`▸ ${c.name}  _id=${c._id}`);
        }

        // =====================================================
        // 3. USERS (with role shape)
        // =====================================================
        console.log('\n═══════════════════════════════════════════');
        console.log(' 3. USERS');
        console.log('═══════════════════════════════════════════');

        const users = await db.collection('users').find({}).toArray();

        console.log(`Total users: ${users.length}\n`);

        for (const u of users) {
            console.log(`▸ ${u.name} <${u.email || '-'}>`);
            console.log(`  _id:       ${u._id}`);
            console.log(`  companyId: ${u.companyId}`);
            console.log(`  role:      ${JSON.stringify(u.role)}  (type: ${typeof u.role}${u.role instanceof ObjectId ? ' [ObjectId]' : ''})`);
            console.log(`  roleId:    ${JSON.stringify(u.roleId)}`);
            console.log(`  status:    ${u.status}`);
            console.log(`  all keys:  ${Object.keys(u).join(', ')}`);
        }

        // =====================================================
        // 4. RESOLVED SCOPE PER USER
        // =====================================================
        console.log('\n═══════════════════════════════════════════');
        console.log(' 4. RESOLVED TASKS SCOPE PER USER');
        console.log('═══════════════════════════════════════════');

        for (const u of users) {
            let resolvedRole = null;

            if (u.role instanceof ObjectId) {
                resolvedRole = roles.find((r) => r._id.equals(u.role));
            } else if (u.roleId instanceof ObjectId) {
                resolvedRole = roles.find((r) => r._id.equals(u.roleId));
            } else if (typeof u.role === 'string') {
                resolvedRole = roles.find((r) => r.name === u.role);
            }

            const taskPerm = resolvedRole?.permissions?.find((p) => p.module === 'tasks');
            const scope = taskPerm?.scope || '(none → falls back to "own")';

            console.log(`▸ ${(u.name || u.email || '').padEnd(25)} → role: ${(resolvedRole?.name || '❌ UNRESOLVED').padEnd(15)} | tasks scope: ${scope}`);
        }

        // =====================================================
        // 5. LEADTASKS — assignedTo distribution
        // =====================================================
        console.log('\n═══════════════════════════════════════════');
        console.log(' 5. LEADTASKS');
        console.log('═══════════════════════════════════════════');

        const tasks = await db.collection('leadtasks').find({}).toArray();

        console.log(`Total tasks: ${tasks.length}\n`);

        for (const t of tasks) {
            console.log(`▸ "${t.title}"`);
            console.log(`   _id:         ${t._id}`);
            console.log(`   companyId:   ${t.companyId}`);
            console.log(`   assignedTo:  ${t.assignedTo}`);
            console.log(`   createdBy:   ${t.createdBy}`);
            console.log(`   leadId:      ${t.leadId}`);
            console.log(`   status:      ${t.status}`);
        }

        console.log('\n✅ Done.\n');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.close();
    }
}

main();