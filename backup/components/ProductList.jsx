import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProductItem from "./ProductItem.jsx";
import ProductPicker from "./ProductPicker.jsx";

export default function ProductList() {
  const [products, setProducts] = useState([
    {
      id: "empty-1",      // temporary ID for empty product
      title: "",           // empty product title
      image: { src: "" },  // empty image
      variants: [],
      discount: null,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState(null);

  return (
    <>
      {/* Add Product Button */}
      <button
        className="add-product-btn"
        onClick={() => {
          setReplaceIndex(null);
          setOpen(true); // open picker to select a new product
        }}
      >
        + Add Product
      </button>

      {/* Product Picker Modal */}
      <ProductPicker
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setReplaceIndex(null);
        }}
        onSelect={(items) => {
          setProducts(prev => {
            if (replaceIndex === null) return [...prev, ...items]; // new product at end
            const copy = [...prev];
            copy.splice(replaceIndex, 1, ...items); // replace empty product or edited product
            return copy;
          });
        }}
      />

      {/* Drag & Drop Product List */}
      <DragDropContext
        onDragEnd={(res) => {
          if (!res.destination) return;
          const items = [...products];
          const [moved] = items.splice(res.source.index, 1);
          items.splice(res.destination.index, 0, moved);
          setProducts(items);
        }}
      >
        <Droppable droppableId="products">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {products.map((product, index) => (
                <Draggable
                  key={product.id}
                  draggableId={`product-${product.id}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{ marginBottom: 8, ...provided.draggableProps.style }}
                    >
                      <ProductItem
                        product={product}
                        dragHandleProps={provided.dragHandleProps}
                        onEdit={() => {
                          setReplaceIndex(index);
                          setOpen(true);
                        }}
                        onRemove={() =>
                          setProducts(pr => pr.filter((_, i) => i !== index))
                        }
                        onDiscountChange={(discount) => {
                          setProducts(pr => {
                            const copy = [...pr];
                            copy[index] = { ...copy[index], discount };
                            return copy;
                          });
                        }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
