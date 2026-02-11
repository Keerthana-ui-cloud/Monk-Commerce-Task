import { useState } from "react";

export default function ProductItem({
  product,
  onRemove,
  onEdit,
  onDiscountChange,
  dragHandleProps
}) {
  const [showVariants, setShowVariants] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);

  return (
    <div className="product-card">
      <div className="product-header">
        <span {...dragHandleProps} className="drag-handle">☰</span>

        {/* Always show input box, with product title if selected */}
        <input
          type="text"
          readOnly
          value={product.title || ""}
          placeholder="Select product"
          onClick={onEdit}   // opens Product Picker
          className="product-title-input"
        />

        {/* <button onClick={onEdit}>✏️</button> */}

        {/* {onRemove && <button onClick={onRemove} className="remove-btn">❌</button>} */}
      </div>

      {/* Discount Section */}
      <div className="discount-box">
        {!showDiscount ? (
          <button onClick={() => setShowDiscount(true)}>Add Discount</button>
        ) : (
          <>
            <select
              value={product.discount?.type || "flat"}
              onChange={(e) =>
                onDiscountChange({ ...product.discount, type: e.target.value })
              }
            >
              <option value="flat">₹</option>
              <option value="percentage">%</option>
            </select>
            <input
              type="number"
              value={product.discount?.value || 0}
              onChange={(e) =>
                onDiscountChange({
                  ...product.discount,
                  value: Number(e.target.value),
                })
              }
            />
        {onRemove && <button onClick={onRemove} className="remove-btn">❌</button>}

          </>
        )}
      </div>

      {/* Variants toggle */}
      {product.variants?.length > 1 && (
        <>
          <div
            className="variant-toggle"
            onClick={() => setShowVariants(v => !v)}
          >
            {showVariants ? "Hide Variants" : "Show Variants"}
          </div>
          {showVariants &&
            product.variants.map(v => (
              <div key={v.id} className="variant">
                {v.title} – ₹{v.price}
              </div>
            ))}
        </>
      )}
    </div>
  );
}
