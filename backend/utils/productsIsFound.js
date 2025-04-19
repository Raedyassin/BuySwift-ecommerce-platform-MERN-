import Product from "../models/product.model.js";
import { FAIL } from "../utils/httpStatucText.js";

const productsIsFound = async (res, products) => {
  if (!products?.length) {
    res.status(400).json({ status: FAIL, message: "No order items" })
    return false;
  }

  const productsIDs = products.map(x => x._id);
  const itemsFromDB = await Product.find({
    _id: { $in: productsIDs }
  })

  // Check if all requested products exist in DB
  const missingProducts = products.filter(
    itemFromClient => !itemsFromDB.some(item => item._id.toString() === itemFromClient._id)
  );

  if (missingProducts.length > 0) {
    res.status(404).json({
      status: FAIL,
      data: {
        title: "Some products were not found",
        products: missingProducts,
      },
    });
    return false;
  }

  const dbOrderItems = products.map( itemFromClient => {
    const matchingItemsFromDB = itemsFromDB.find(
      item => item._id.toString() === itemFromClient._id
    );

    return {
      ...itemFromClient,
      product: matchingItemsFromDB._id,
      price: matchingItemsFromDB.price,
      image: matchingItemsFromDB.img
    }
  });
  return dbOrderItems
}

export default productsIsFound;