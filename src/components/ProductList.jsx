import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProductItem from "./ProductItem";

export default function ProductList({ products = [], setProducts, onEdit }) {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(products);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setProducts(items);
  };

  return (
    <>
    <div className="subTitle">
      <div className="productTitle">Product</div>
      <div className="discountTxt">Discount</div>
    </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="products">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {products.map((product, index) => (
                <Draggable key={product.id} draggableId={`p-${product.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{ marginBottom: 16, ...provided.draggableProps.style }}
                    >
                      <ProductItem
                        index={index}
                        product={product}
                        dragHandleProps={provided.dragHandleProps}
                        onRemove={() =>
                          setProducts(products.filter((_, i) => i !== index))
                        }
                        onEdit={() => onEdit(index)}
                        onDiscountChange={(discount) => {
                          const newProducts = [...products];
                          newProducts[index].discount = discount;
                          setProducts(newProducts);
                        }}
                        onVariantChange={(variants) => {
                          const newProducts = [...products];
                          newProducts[index].variants = variants;
                          setProducts(newProducts);
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
