function AddProductButton({ setProducts }) {
  const handleAdd = () => {
    setProducts(prev => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        variants: [],
        isEmpty: true
      }
    ]);
  };

  return (
    <button onClick={handleAdd}>
      + Add Product
    </button>
  );
}

export default AddProductButton;
