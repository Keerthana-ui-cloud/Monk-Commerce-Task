import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/productPicker.css"

const API_KEY = "72njgfa948d9aS7gs5";
const BASE_URL = "https://stageapi.monkcommerce.app/task/products/search";

export default function ProductPicker({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loader = useRef(null);

  // Reset when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setProducts([]);
    setPage(0);
    setSelected([]);
    setHasMore(true);
  }, [isOpen]);

  // Fetch products
  useEffect(() => {
    if (!isOpen || !hasMore) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(BASE_URL, {
          params: { search, page, limit: 10 },
          headers: { "x-api-key": API_KEY },
        });

        let newProducts = [];
        if (Array.isArray(response.data)) newProducts = response.data;
        else if (response.data?.products)
          newProducts = response.data.products;

        if (newProducts.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const filtered = newProducts.filter(
              (p) => !existingIds.has(p.id)
            );
            return [...prev, ...filtered];
          });
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, page, isOpen]);

  // Infinite Scroll
  useEffect(() => {
    if (!loader.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loading, hasMore]);

  // Toggle product
  const toggleProduct = (product) => {
    setSelected((prev) => {
      const exists = prev.some((p) => p.id === product.id);

      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        const variants = product.variants?.map((v) => ({ ...v })) || [];
        return [...prev, { id: product.id, title: product.title, variants }];
      }
    });
  };

  // Toggle variant
  const toggleVariant = (product, variant) => {
    setSelected((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);

      if (!existingProduct) {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            variants: [variant],
          },
        ];
      }

      const updated = prev.map((p) => {
        if (p.id !== product.id) return p;

        const variantExists = p.variants.some(
          (v) => v.id === variant.id
        );

        const updatedVariants = variantExists
          ? p.variants.filter((v) => v.id !== variant.id)
          : [...p.variants, variant];

        return { ...p, variants: updatedVariants };
      });

      return updated.filter((p) => p.variants.length > 0);
    });
  };

  const handleAdd = () => {
    onSelect(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* Header */}
        <div className="modalInner">
          <div className="searchSubHead">
            <div className="firstTxt">Select Products</div>
            <button onClick={onClose}></button>
          </div>

          <div className="searchWrap">
            <input
              type="text"
              className="searchInput"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setProducts([]);
                setPage(0);
                setHasMore(true);
              }}
            />
          </div>
        </div>

        {/* Product List */}
        <div  className="productScroll">
          {products.map((p, idx) => {
            const selectedProduct = selected.find(
              (sp) => sp.id === p.id
            );

            const totalVariants = p.variants?.length || 0;
            const selectedCount =
              selectedProduct?.variants?.length || 0;

            const allVariantsSelected =
              totalVariants > 0 &&
              selectedCount === totalVariants;

            const someVariantsSelected =
              selectedCount > 0 &&
              selectedCount < totalVariants;

            return (
              <div
                className="productWrap"
                key={`product-${p.id}-${idx}`}
                style={{ borderBottom: "1px solid #ccc" }}
              >

                {/* Main Product */}
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={allVariantsSelected}
                    ref={(el) => {
                      if (el)
                        el.indeterminate = someVariantsSelected;
                    }}
                    onChange={() => toggleProduct(p)}
                  />
                  <span className="checkmark"></span>

                  <img
                    src={
                      p.image?.src ||
                      "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1"
                    }
                    alt={p.title}
                    width={36}
                    height={36}
                    style={{
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />

                  <strong>{p.title}</strong>
                </label>

                {/* Variants */}
                {p.variants?.map((v, vIdx) => {
                  const variantSelected =
                    selectedProduct?.variants?.some(
                      (vp) => vp.id === v.id
                    );

                  return (
                    <div
                      key={`variant-${v.id}-${vIdx}`}
                      style={{ paddingLeft: 24 }}
                    >
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={variantSelected || false}
                          onChange={() =>
                            toggleVariant(p, v)
                          }
                        />
                        <span className="checkmark"></span>

                        <span className="title">
                          {v.title}
                        </span>
                        <span className="price">
                          ${v.price}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {loading && (
            <p style={{ textAlign: "center" }}>
              Loading...
            </p>
          )}

          {!hasMore && (
            <p style={{ textAlign: "center" }}>
              No more products
            </p>
          )}

          <div ref={loader}></div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <span className="selectedProduct">
            {selected.length} product selected
          </span>

          <button className="cancelBtn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="addBtn"
            onClick={handleAdd}
            disabled={selected.length === 0}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
