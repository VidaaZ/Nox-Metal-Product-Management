import { db } from '../models/database.js';

async function fixProductTimezones() {
  console.log('Starting timezone fix for existing products...');
  
  return new Promise<void>((resolve, reject) => {
    // Get all products
    db.all('SELECT id, created_at, updated_at FROM products', [], (err, products: any[]) => {
      if (err) {
        console.error('Error fetching products:', err);
        reject(err);
        return;
      }
      
      console.log(`Found ${products.length} products to update`);
      
      let updatedCount = 0;
      
      products.forEach((product) => {
        // Convert UTC timestamps to Canada timezone
        const createdDate = new Date(product.created_at);
        const updatedDate = new Date(product.updated_at);
        
        // Convert to Canada timezone
        const canadaCreated = new Date(createdDate.toLocaleString("en-US", {timeZone: "America/Toronto"}));
        const canadaUpdated = new Date(updatedDate.toLocaleString("en-US", {timeZone: "America/Toronto"}));
        
        const newCreatedAt = canadaCreated.toISOString();
        const newUpdatedAt = canadaUpdated.toISOString();
        
        // Update the product
        db.run(
          'UPDATE products SET created_at = ?, updated_at = ? WHERE id = ?',
          [newCreatedAt, newUpdatedAt, product.id],
          function(err) {
            if (err) {
              console.error(`Error updating product ${product.id}:`, err);
            } else {
              updatedCount++;
              console.log(`Updated product ${product.id}: ${product.created_at} → ${newCreatedAt}`);
            }
            
            // Check if all products have been processed
            if (updatedCount === products.length) {
              console.log(`Successfully updated ${updatedCount} products`);
              resolve();
            }
          }
        );
      });
    });
  });
}

// Run the fix
fixProductTimezones()
  .then(() => {
    console.log('Timezone fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Timezone fix failed:', error);
    process.exit(1);
  }); 