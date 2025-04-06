import { FAIL } from "./httpStatucText.js";

export const minMaxConvertFromString = (res, textBeforeConvert, speratedOperator) => {
  let priceArray = textBeforeConvert.split(speratedOperator.trim());
  if (priceArray.length === 2 && (isNaN(priceArray[0]) || isNaN(priceArray[1]))) {
    return res.status(400).json({ status: FAIL, message: "the price should be number" })
  } else if (priceArray.length === 1 && isNaN(priceArray[0])) {
    return res.status(400).json({ status: FAIL, message: "the price should be number" })
  } else if (priceArray.length > 2) {
    return res.status(400).json({ status: FAIL, message: "the price should be number separated by - like(100-200) or like(100)" })
  }

  let price = {};
  if (priceArray.length === 1) {
    price = {
      $eq: +priceArray[0],
    };
  } else if (priceArray.length === 2) {
    const min = +priceArray[0];
    const max = +priceArray[1];
    if (max !== 0 && min > max) {
      return res.status(400).json({ status: FAIL, message: "the price should be number separated by - like(100-200) or like(100)" })
    }
    if (priceArray[0] === "") {
      price = {
        // $gte: -100,
        $lte: max
      };
    } else if (priceArray[1] === "") {
      price = {
        $gte: min,
        // $lte: Infinity
      };
    } else {
      price = {
        $gte: min,
        $lte: max
      };
    }
  }
  return price
};

