import { defineField, defineType } from "sanity"

export const product = defineType({
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
      },
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "availability",
      title: "Availability",
      type: "string",
      options: {
        list: [
          { title: "In Stock", value: "inStock" },
          { title: "Out of Stock", value: "outOfStock" },
          { title: "Limited", value: "limited" },
        ],
      },
      description: "Availability status of the product.",
    },
    {
      name: "validityPeriod",
      title: "Validity Period",
      type: "string",
      description:
        "Duration for which the product or offer is valid, e.g., '6 months', '1 year'.",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "sku",
      title: "SKU",
      type: "string",
    },
    {
      name: "currency",
      title: "Currency",
      type: "string",
    },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
  ],
})
