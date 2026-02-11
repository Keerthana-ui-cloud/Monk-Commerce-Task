import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import "../css/productItem.css"

export default function ProductItem({
  product,
  index, // <-- index from ProductList
  onRemove,
  onEdit,
  onDiscountChange,
  onVariantChange,
}) {
  const [showDiscount, setShowDiscount] = useState(false);
  const [showVariants, setShowVariants] = useState(true);

  const handleVariantDiscountChange = (variantIndex, discount) => {
    const newVariants = [...product.variants];
    newVariants[variantIndex] = { ...newVariants[variantIndex], discount };
    onVariantChange(newVariants);
  };

  const removeVariant = (variantId) => {
    const newVariants = product.variants.filter((v) => v.id !== variantId);
    onVariantChange(newVariants);
  };

  return (
    <Draggable draggableId={`product-${product.id}`} index={index}>
      {(provided) => (
        <div
          className="product-card1"
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{ ...provided.draggableProps.style }}
        >
          {/* Product Header */}
          <div className="product-card">
            <div className="product-header" {...provided.dragHandleProps} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Product number */}
              <span style={{ fontWeight: "bold", width: "20px" }}>{index + 1}.</span>

              <input
                type="text"
                readOnly
                value={product.title || ""}
                onClick={onEdit}
                className={`product-title-input`}
                placeholder="Select Product"
                style={{ flex: 1 }}
              />
             
            </div>

            {/* Discount */}
            <div className="discount-box">
              {!showDiscount ? (
                <button onClick={() => setShowDiscount(true)} className="discountBtn">Add Discount</button>
              ) : (
                <>
                <input
                    type="number"
                    value={product.discount?.value || 0}
                    onChange={(e) =>
                      onDiscountChange({ ...product.discount, value: Number(e.target.value) })
                    }
                  />
                  <select
                    value={product.discount?.type || "flat"}
                    onChange={(e) =>
                      onDiscountChange({ ...product.discount, type: e.target.value })
                    }
                  >
                    <option value="flat">₹ Off</option>
                    <option value="percentage">% Off</option>
                  </select>
                  
                </>
              )}
            </div>
              {onRemove && <button   className={`closeBtn ${
    !product.title ? "product-title-empty" : ""
  }`} onClick={onRemove}></button>}

          </div>
           {product.variants?.length > 1 && (
                <button className="variantDrop" onClick={() => setShowVariants(!showVariants)}>
                  {showVariants ? "Hide Variants" : "Show Variants"}
                </button>
              )}
          {/* Nested Variants */}
          {showVariants && product.variants?.length > 0 && (
            <Droppable droppableId={`variants-${product.id}`} type={`variant`}>
              {(provided) => (
                <div
                  className="variant-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {product.variants.map((v, idx) => (
                    <Draggable
                      key={`variant-${product.id}-${v.id}`}
                      draggableId={`variant-${product.id}-${v.id}`}
                      index={idx}
                    >
                      {(provided) => (
                        <div
                          className="variant-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginLeft: "28px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <input className="variantsInput" type="text" readOnly value={v.title} />
                          <input className="variantPrice" type="text"  value={v.price} />

                          <select className="variantDis"
                            value={v.discount?.type || "flat"}
                            onChange={(e) =>
                              handleVariantDiscountChange(idx, {
                                ...v.discount,
                                type: e.target.value,
                              })
                            }
                          >
                            <option value="flat">₹ Off</option>
                            <option value="percentage">% Off</option>
                          </select>
                          <button onClick={() => removeVariant(v.id)} className="closeBtn"></button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
}
