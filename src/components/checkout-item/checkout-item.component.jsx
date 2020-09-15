import React from "react";
import "./checkout-item.styles.scss";
// import { toggleCartHidden } from "../../redux/cart/cart.actions";
// import { connect } from "react-redux";
// import { selectCartItemsCount } from "../../redux/cart/cart.selectors";
// import { createStructuredSelector } from "reselect";

const CheckoutItem = ({ cartItem: { name, imageUrl, price, quantity } }) => (
  <div className="checkout-item">
    <div className="image-container">
      <img src={imageUrl} alt="item" />
    </div>
    <span className="name">{name}</span>
    <span className="quantity">{quantity}</span>
    <span className="price">{price}</span>
    <div className="remove-button">&#10005;</div>
  </div>
);

export default CheckoutItem;
