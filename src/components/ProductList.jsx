import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProductItem from "./ProductItem";

export default function ProductList({ products = [], setProducts, onEdit }) {
const onDragEnd = (result) => {
  const { source, destination, type } = result;

  if (!destination) return;

  // ------------------------
  // PRODUCT REORDER
  // ------------------------
  if (type === "PRODUCT") {
    const reordered = Array.from(products);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setProducts(reordered);
    return;
  }

  // ------------------------
  // VARIANT REORDER
  // ------------------------
  if (type.startsWith("VARIANT")) {
    const productId = source.droppableId.split("-")[1];

    const productIndex = products.findIndex(
      (p) => String(p.id) === productId
    );

    if (productIndex === -1) return;

    const product = products[productIndex];
    const newVariants = Array.from(product.variants);

    const [movedVariant] = newVariants.splice(source.index, 1);
    newVariants.splice(destination.index, 0, movedVariant);

    const newProducts = [...products];
    newProducts[productIndex] = {
      ...product,
      variants: newVariants,
    };

    setProducts(newProducts);
  }
};


  return (
    <>
      <div className="subTitle">
        <div className="productTitle">Product</div>
        <div className="discountTxt">Discount</div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="products" type="PRODUCT">
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
                        canRemoveProduct={products.length > 1}
                        onRemove={
                          products.length > 1
                            ? () => setProducts(products.filter((_, i) => i !== index))
                            : null
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
