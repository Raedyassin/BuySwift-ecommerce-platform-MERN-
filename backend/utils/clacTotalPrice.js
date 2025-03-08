export const calcTotalPrice = (orderItems) => {
  const priceWithoutAdds = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const priceWithShippingAdds = priceWithoutAdds > 100 ? 0 : 10;
  const taxRate = 0.25;
  const priceWithTaxAdds = priceWithoutAdds * taxRate;
  const totalPrice = (priceWithoutAdds + priceWithShippingAdds + priceWithTaxAdds).toFixed(2);
  return {
    itemsPrice: priceWithoutAdds.toFixed(2),
    shippingPrice: priceWithShippingAdds.toFixed(2),
    taxPrice: priceWithTaxAdds.toFixed(2),
    totalPrice,
  }
}
