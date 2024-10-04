import { client } from "@/sanity/lib/client";
import { inventory } from "@/config/inventory";

export async function seedSanityData() {
  const transaction = client.transaction();
  
  inventory.forEach((item) => {
    const product = {
      _type: "product",
      _id: item.id,
      name: item.name,
      currency: item.currency,
      description: item.description,
      price: item.price,
      sku: item.sku,
      availability: item.availability,
      validityPeriod: item.validityPeriod,
      categories: item.categories,
    };
    transaction.createOrReplace(product);
  });
  
  await transaction.commit();
  await seedSanityImages();
  console.log("Sanity data seeded");
}

async function seedSanityImages() {
  await Promise.all(inventory.map(async (item) => {
    // Ensure images are valid URLs
    if (!Array.isArray(item.images) || item.images.some(image => typeof image !== 'string')) {
      console.error(`Invalid image format for item ${item.id}:`, item.images);
      return; // Skip this item if images are not valid
    }

    const images = await Promise.all(item.images.map(async (image) => {
      try {
        const imageAssetResponse = await fetch(image);
        if (!imageAssetResponse.ok) {
          throw new Error(`Failed to fetch image from ${image}`);
        }
        const imageAssetBuffer = await imageAssetResponse.arrayBuffer();
        const imageAsset = await client.assets.upload(
          "image",
          Buffer.from(imageAssetBuffer)
        );
        return {
          _key: imageAsset._id,
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        };
      } catch (error) {
        console.error(`Error uploading image for item ${item.id}:`, error);
        return null; // Handle error gracefully
      }
    }));

    // Filter out any null images in case of errors
    const validImages = images.filter(image => image !== null);
    
    // Patch the product with images and slug
    await client
      .patch(item.id)
      .set({ "slug.current": slugify(item.name), images: validImages })
      .commit();
  }));
}

// Slugify function to format the product names
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}
