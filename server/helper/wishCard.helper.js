async function calculateWishItemTotalPrice(itemPrice) {
	// fee for processing item. 3% charged by stripe for processing each card trasaction + 5% from us to cover the possible item price change difference
	const PROCESSING_FEE = 1.08;
	// Open for discussion. Each state has its own tax so maybe create values for each individual(key-value) or use a defined one for everything since we are
	// doing all the shopping
	const TAX = 1.0712;
	const processingItemFee = itemPrice * PROCESSING_FEE - itemPrice;
	const itemTax = itemPrice * TAX - itemPrice;
	const totalPrice = itemPrice + itemTax + processingItemFee;
	const roundTotalPrice = totalPrice.toFixed(2);
	return roundTotalPrice;
}

module.exports = {
	calculateWishItemTotalPrice,
};
