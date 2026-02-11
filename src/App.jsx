import { useState } from "react";
import ProductList from "./components/ProductList";
import ProductPicker from "./components/ProductPicker";

export default function App() {
  const [products, setProducts] = useState([
    { id: "temp-1", title: "", variants: [], discount: null },
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setPickerOpen(true);
  };

  const handleSelectProducts = (selected) => {
    if (editingIndex === null) return;

    // Replace the product at editingIndex with selected products
    const newProducts = [...products];
    newProducts.splice(editingIndex, 1, ...selected);
    setProducts(newProducts);
    setEditingIndex(null);
  };

  const addEmptyProduct = () => {
    setProducts([
      ...products,
      { id: `temp-${products.length + 1}`, title: "", variants: [], discount: null },
    ]);
  };

  return (
    <div className="container">
      <div className="innerWrap">
        <div className="titleWrap">Add Products </div>

        <ProductList products={products} setProducts={setProducts} onEdit={handleEdit} />

        <ProductPicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleSelectProducts}
          selectedProducts={products}
        />
        <div className="addPrdWrap">
          <button onClick={addEmptyProduct} className="add-product-btn">Add Product</button>
        </div>
      </div>
    </div>
  );
}
