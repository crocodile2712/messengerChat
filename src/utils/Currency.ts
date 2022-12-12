import type { CartItem } from 'types/product';

class Currency {
  public templatePriceVI(price?: number) {
    return price && Math.round(price).toLocaleString('ja-JA');
  }

  public calculateTotalPrice(
    cartItems: CartItem[],
    customerRateFee: number | null,
    priceRate: number
  ) {
    return cartItems.reduce((prev, cur) => {
      const vShipFee = this.calculateVShipFee(
        cur.price,
        customerRateFee,
        priceRate
      );
      const paymentFee = 100 * priceRate;
      const total: number = vShipFee + paymentFee + cur.price * priceRate;
      return prev + total;
    }, 0);
  }

  public calculateTotalPriceJA(
    cartItems: CartItem[],
    customerRateFee: number | null,
    priceRate: number
  ) {
    const totalPrice = this.calculateTotalPrice(
      cartItems,
      customerRateFee,
      priceRate
    );
    return Math.round(totalPrice / priceRate).toLocaleString('ja-JA');
  }

  public calculateTotalPriceVN(
    cartItems: CartItem[],
    customerRateFee: number | null,
    priceRate: number
  ) {
    const totalPrice = this.calculateTotalPrice(
      cartItems,
      customerRateFee,
      priceRate
    );
    return Math.round(totalPrice).toLocaleString('ja-JA');
  }

  public calculateVShipFeeVN(
    productPrice: number,
    customerRateFee: number | null,
    priceRate: number
  ) {
    const vShipFee = this.calculateVShipFee(
      productPrice,
      customerRateFee,
      priceRate
    );
    return Math.round(vShipFee).toLocaleString('ja-JA');
  }

  public calculateVShipFeeJA(
    productPrice: number,
    customerRateFee: number | null,
    priceRate: number
  ) {
    const total = this.calculateVShipFee(
      productPrice,
      customerRateFee,
      priceRate
    );
    return Math.round(total / priceRate).toLocaleString('ja-JA');
  }

  public calculateVShipFee(
    productPrice: number,
    customerRateFee: number | null,
    priceRate: number
  ) {
    if (!customerRateFee) customerRateFee = 0;

    const serviceFee = productPrice * (customerRateFee * 0.01) * priceRate;

    let surcharge = 0;

    if (productPrice * priceRate + serviceFee < 1000000) {
      surcharge = 30000;
    }

    let total = serviceFee + surcharge;

    return total;
  }

  public calculateTotalPriceProduct(
    productPrice: number,
    customerRateFee: number | null,
    priceRate: number
  ) {
    const paymentFee = 100 * priceRate;
    const total =
      this.calculateVShipFee(productPrice, customerRateFee, priceRate) +
      productPrice * priceRate +
      paymentFee;
    return total;
  }

  public calculateTotalPriceProductVI(
    productPrice: number,
    customerRateFee: number | null,
    priceRate: number
  ) {
    const totalProduct = this.calculateTotalPriceProduct(
      productPrice,
      customerRateFee,
      priceRate
    );
    return Math.round(totalProduct).toLocaleString('ja-JA');
  }

  public calculateTotalPriceProductJA(
    productPrice: number,
    customerRateFee: number | null,
    priceRate: number
  ) {
    const totalProduct = this.calculateTotalPriceProduct(
      productPrice,
      customerRateFee,
      priceRate
    );
    return Math.round(totalProduct / priceRate).toLocaleString('ja-JA');
  }
}

export default new Currency();
