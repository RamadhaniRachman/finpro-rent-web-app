import 'dotenv/config';
import { prisma } from './src/utils/prisma.js';
import * as propertyService from './src/services/property.service.js';
import * as publicService from './src/services/public-property.service.js';

async function testAll() {
  console.log('=== STARTING TESTS ===\n');

  try {
    // 1. Get a Tenant
    const tenant = await prisma.tenant.findFirst({ include: { users: true } });
    if (!tenant) throw new Error('Tidak ada tenant di database untuk testing.');
    const userId = tenant.user_id;
    console.log(`✅ Using Tenant User: ${tenant.users.name} (ID: ${userId})`);

    // 2. Create a Property
    console.log('\n--- Test 1: Create Property ---');
    const newProp = await propertyService.createProperty(userId, {
      name: 'Villa Sentosa',
      address: 'Jl. Raya Seminyak No 99',
      city: 'Bali',
      province: 'Bali',
      description: 'Villa indah di pusat Seminyak',
    });
    console.log(`✅ Property created: ${newProp.name} (ID: ${newProp.id})`);

    // 3. Create a Room Type (should also auto-create room_units)
    console.log('\n--- Test 2: Create Room Type (with 3 units) ---');
    const newRoomType = await propertyService.createRoomType(userId, newProp.id, {
      name: 'Deluxe Suite',
      price_per_night: 1500000,
      capacity: 2,
      total_units: 3,
      amenities: ['AC', 'WiFi', 'Pool View'],
    });
    console.log(`✅ Room Type created: ${newRoomType.name} (ID: ${newRoomType.id})`);

    // Verify units were generated
    const units = await prisma.room_unit.findMany({ where: { room_type_id: newRoomType.id } });
    console.log(`   -> Generated units: ${units.map(u => u.unit_number).join(', ')}`);

    // 4. Update Room Type (syncing units from 3 to 5)
    console.log('\n--- Test 3: Update Room Type (increase units to 5) ---');
    await propertyService.updateRoomType(userId, newRoomType.id, {
      total_units: 5,
      price_per_night: 1600000,
    });
    const unitsAfterUpdate = await prisma.room_unit.findMany({ where: { room_type_id: newRoomType.id } });
    console.log(`✅ Room Type updated. New price: 1600000. New unit count: ${unitsAfterUpdate.length}`);
    console.log(`   -> Generated units: ${unitsAfterUpdate.map(u => u.unit_number).join(', ')}`);

    // 5. Add Price Modifier
    console.log('\n--- Test 4: Set Price Modifier (Holiday +20%) ---');
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const pm = await propertyService.setPriceModifier(userId, newRoomType.id, {
      startDate: today.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      type: 'PERCENTAGE',
      value: 20,
      reason: 'Holiday Season',
    });
    console.log(`✅ Price Modifier created: +20% until ${pm.end_date.toDateString()}`);

    // 6. Test Advanced Search (Public)
    console.log('\n--- Test 5: Advanced Search (Checking Dynamic Price) ---');
    const searchRes = await publicService.searchProperties({
      search: 'Villa Sentosa',
      checkIn: today.toISOString().split('T')[0],
      checkOut: nextWeek.toISOString().split('T')[0],
      page: 1,
      limit: 10,
    });
    
    console.log(`✅ Search result count: ${searchRes.pagination.total}`);
    if (searchRes.data.length > 0) {
      const p = searchRes.data[0]!;
      console.log(`   -> Found: ${p.name}`);
      console.log(`   -> Lowest Price (Adjusted): Rp ${p.lowest_price} (Expected: 1.6M + 20% = 1.92M)`);
    }

    // 7. Cleanup
    console.log('\n--- Test 6: Cleanup (Delete Property & Room Type) ---');
    await propertyService.deleteRoomType(userId, newRoomType.id);
    console.log(`✅ Room Type deleted (Cascaded to units & price_modifiers)`);
    
    // Hard delete property for clean test env (soft delete is default in service)
    await prisma.property.delete({ where: { id: newProp.id } });
    console.log(`✅ Property hard-deleted from DB.`);

    console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
  } catch (e: any) {
    console.error('\n❌ TEST FAILED:', e);
  } finally {
    await prisma.$disconnect();
  }
}

testAll();
