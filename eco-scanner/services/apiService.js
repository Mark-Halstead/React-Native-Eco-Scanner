export const fetchProductInfo = async (barcode) => {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();
    return data.product;
  };
  