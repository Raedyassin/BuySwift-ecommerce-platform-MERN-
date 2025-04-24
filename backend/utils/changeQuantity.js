import Product from "../models/product.model.js";
const reduceQuantity = async (res, products) => {
  const stopOnId = -1;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    // we check if the product is found before call this function
    const productFromDB = await Product.findById(product._id)
    if (productFromDB.quantity < product.quantity) {
      res.status(400).json({ status: FAIL, message: "Quantity of product" + productFromDB.name + " is not enough" })
      stopOnId = i;
      break;
    }
    productFromDB.quantity -= product.quantity;
    productFromDB.sold += product.quantity;
    await productFromDB.save();
  }

  if (stopOnId !== -1) {
    for (let i = stopOnId; i < stopOnId; i++) {
      const product = products[i];
      const productFromDB = await Product.findById(product._id);
      productFromDB.quantity += product.quantity;
      productFromDB.sold -= product.quantity;
      await productFromDB.save();
    }
    return false;
  }
  return true;
}
const increaseQuantity = async (products) => {
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productFromDB = await Product.findById(product._id)
    productFromDB.quantity += product.quantity;
    productFromDB.sold -= product.quantity;
    await productFromDB.save();
  }
}

export { reduceQuantity, increaseQuantity }