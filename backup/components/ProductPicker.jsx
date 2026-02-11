import { useState, useEffect } from "react";
import mockProducts from "../api/mockProducts.js"; // replace with API if ready

export default function ProductPicker({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  if (!isOpen) return null;

  const filteredProducts = mockProducts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (product) => {
    setSelected(prev => {
      if (prev.some(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleAdd = () => {
    onSelect(selected);
    setSelected([]);
    onClose();
  };

  return (
    <div className="modal-overlay">

      <div className="modal">
        <div className="searchSubHead">
          <div className="firstTxt">Select Products</div>
          <button onClick={onClose}>x</button>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {filteredProducts.map(p => (
          <div key={p.id} className="picker-item">
            <input
              type="checkbox"
              checked={selected.some(s => s.id === p.id)}
              onChange={() => toggleSelect(p)}
            />
            <img src={p.image.src} alt={p.title} width={40} height={40} />
            <span>{p.title}</span>
          </div>
        ))}

        <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleAdd} style={{ background: "#008060", color: "white" }}>
            Add Selected
          </button>
        </div>
      </div>
    </div>
  );
}
