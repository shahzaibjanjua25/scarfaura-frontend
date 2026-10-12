import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'Printed Hijabs', value: 'Printed Hijabs' },
  { label: 'Georgette Hijabs', value: 'Georgette Hijabs' },
  { label: 'Modal Hijabs', value: 'Modal Hijabs' },
  { label: 'Jersey Hijabs', value: 'Jersey Hijabs' },
  { label: 'Deer Prints', value: 'Deer Prints' },
  { label: 'Leopard Prints', value: 'Leopard Prints' },
];

const colors = [
  { label: 'Select Color', value: '' },
  { label: 'Black', value: 'black' },
  { label: 'Brown', value: 'brown' },
  { label: 'Maroon', value: 'maroon' },
  { label: 'Zinc', value: 'zinc' },
  { label: 'Navy Blue', value: 'navy blue' },
  { label: 'White', value: 'white' },
  { label: 'Skin', value: 'skin' },
  { label: 'Burgundy', value: 'burgundy' },
  { label: 'Purple', value: 'purple' },
  { label: 'Grey', value: 'grey' },
  { label: 'Plum', value: 'plum' },
  { label: 'Red', value: 'red' },
  { label: 'Gold', value: 'gold' },
  { label: 'Blue', value: 'blue' },
  { label: 'Silver', value: 'silver' },
  { label: 'Beige', value: 'beige' },
  { label: 'Green', value: 'green' },
  { label: 'Sage Green', value: 'sagegreen' },
];

const emptyProduct = {
  name: '',
  categories: [],
  color: '',
  price: '',
  oldPrice: '',
  description: '',
};

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(emptyProduct);
  const [images, setImages] = useState([]);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryValue) => {
    setProduct((prev) => {
      const current = prev.categories || [];
      return {
        ...prev,
        categories: current.includes(categoryValue)
          ? current.filter((c) => c !== categoryValue)
          : [...current, categoryValue],
      };
    });
  };

  const makePrimaryCategory = (categoryValue) => {
    setProduct((prev) => ({
      ...prev,
      categories: [categoryValue, ...prev.categories.filter((c) => c !== categoryValue)],
    }));
  };

  const isColorRequired = product.categories.includes('Georgette Hijabs');

  const showError = (message) => setDialog({ show: true, type: 'error', message });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name ||
      product.categories.length === 0 ||
      !product.price ||
      !product.description ||
      images.length === 0
    ) {
      showError(
        'Please fill in all required fields, select at least one category, and upload at least one image.'
      );
      return;
    }

    if (isColorRequired && !product.color) {
      showError('Color is required when "Georgette Hijabs" category is selected.');
      return;
    }

    if (!user?._id) {
      showError('Your session has expired. Please sign in again.');
      return;
    }

    const productData = {
      name: product.name.trim(),
      category: product.categories[0],
      categories: product.categories,
      color: product.color || undefined,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
      description: product.description.trim(),
      images,
      image: images[0],
      author: user._id,
    };

    try {
      const result = await addProduct(productData).unwrap();

      const savedCategories = result?.product?.categories || [];
      if (savedCategories.length !== product.categories.length) {
        console.warn(
          'MISMATCH — sent',
          product.categories.length,
          'categories:',
          product.categories,
          'but server stored',
          savedCategories.length + ':',
          savedCategories
        );
      }

      const savedImages = result?.product?.images || [];
      if (savedImages.length !== images.length) {
        console.warn('MISMATCH — sent', images.length, 'images but server stored', savedImages.length);
      }

      setDialog({
        show: true,
        type: 'success',
        message: 'Product added successfully! Redirecting to shop…',
      });

      setTimeout(() => {
        setProduct(emptyProduct);
        setImages([]);
        navigate('/shop');
      }, 2000);
    } catch (err) {
      console.error('Add product error:', err);
      showError(err.data?.message || 'Failed to add product. Please try again.');
    }
  };

  const closeDialog = () => setDialog((prev) => ({ ...prev, show: false }));

  return (
    <div className="ap-page">
      <style>{`
        .ap-page {
          --ink: #241C1E;
          --paper: #FAF7F5;
          --card: #FFFFFF;
          --plum: #5A1A2B;
          --rule: #E7DFDA;
          --muted: #8A7F7B;
          --hush: #F2ECE8;
          min-height: 100vh;
          background: var(--paper);
          padding: 2.5rem 1.25rem 4rem;
          font-family: 'Karla', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .ap-wrap {
          max-width: 720px;
          margin: 0 auto;
        }
        .ap-header {
          margin-bottom: 2.25rem;
        }
        .ap-eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 600;
          margin: 0 0 0.5rem;
        }
        .ap-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(1.85rem, 4vw, 2.4rem);
          font-weight: 500;
          color: var(--ink);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .ap-card {
          background: var(--card);
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(36,28,30,0.04), 0 12px 32px rgba(36,28,30,0.06);
          padding: 2rem 1.75rem 2.25rem;
          border: 1px solid rgba(231,223,218,0.6);
        }
        @media (min-width: 640px) {
          .ap-card { padding: 2.35rem 2.5rem 2.75rem; }
        }
        .ap-form { display: flex; flex-direction: column; gap: 1.65rem; }
        .ap-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 0.45rem;
          letter-spacing: 0.01em;
        }
        .ap-label .req { color: var(--plum); margin-left: 2px; }
        .ap-hint {
          font-size: 0.75rem;
          color: var(--muted);
          margin-top: 0.4rem;
        }
        .ap-hint--warn { color: #B45309; }
        .ap-fieldset {
          border: none;
          padding: 0;
          margin: 0;
        }
        .ap-cats {
          background: var(--hush);
          border-radius: 14px;
          padding: 1rem 1.1rem;
          border: 1px solid var(--rule);
        }
        .ap-cat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.45rem 0;
        }
        .ap-cat-label {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--ink);
          transition: color 0.15s;
        }
        .ap-cat-label:hover { color: var(--plum); }
        .ap-cat-label input {
          width: 1.05rem;
          height: 1.05rem;
          accent-color: var(--plum);
          cursor: pointer;
        }
        .ap-primary-tag {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--plum);
          background: rgba(90,26,43,0.08);
          padding: 0.25rem 0.55rem;
          border-radius: 999px;
        }
        .ap-make-primary {
          font-size: 0.72rem;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0;
        }
        .ap-make-primary:hover { color: var(--plum); }
        .ap-cat-summary {
          font-size: 0.78rem;
          color: var(--muted);
          margin-top: 0.65rem;
        }
        .ap-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 560px) {
          .ap-grid-2 { grid-template-columns: 1fr 1fr; }
        }
        .ap-textarea {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1.5px solid var(--rule);
          border-radius: 12px;
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--ink);
          background: #fff;
          resize: vertical;
          min-height: 140px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ap-textarea:focus {
          outline: none;
          border-color: var(--plum);
          box-shadow: 0 0 0 3px rgba(90,26,43,0.12);
        }
        .ap-textarea::placeholder { color: #B0A8A4; }
        .ap-submit {
          width: 100%;
          margin-top: 0.5rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #5A1A2B 0%, #7A2A3B 100%);
          color: #fff;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 16px rgba(90,26,43,0.28);
        }
        .ap-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(90,26,43,0.35);
        }
        .ap-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .ap-submit-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
        }
        .ap-spinner {
          width: 1.15rem;
          height: 1.15rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: ap-spin 0.7s linear infinite;
        }
        @keyframes ap-spin { to { transform: rotate(360deg); } }

        /* Dialog */
        .ap-dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(36,28,30,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.25rem;
          animation: ap-fade 0.2s ease;
        }
        @keyframes ap-fade { from { opacity: 0; } to { opacity: 1; } }
        .ap-dialog {
          background: #fff;
          border-radius: 18px;
          padding: 1.75rem 1.6rem 1.5rem;
          max-width: 360px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(36,28,30,0.18);
          border-top: 4px solid;
          animation: ap-up 0.28s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes ap-up {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
        .ap-dialog--success { border-top-color: #059669; }
        .ap-dialog--error { border-top-color: #DC2626; }
        .ap-dialog-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.35rem;
          margin: 0 0 0.5rem;
        }
        .ap-dialog--success .ap-dialog-title { color: #059669; }
        .ap-dialog--error .ap-dialog-title { color: #DC2626; }
        .ap-dialog-msg {
          color: #4B4543;
          font-size: 0.95rem;
          line-height: 1.55;
          margin: 0 0 1.35rem;
        }
        .ap-dialog-btn {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: background 0.18s;
        }
        .ap-dialog--success .ap-dialog-btn { background: #059669; }
        .ap-dialog--success .ap-dialog-btn:hover { background: #047857; }
        .ap-dialog--error .ap-dialog-btn { background: #DC2626; }
        .ap-dialog--error .ap-dialog-btn:hover { background: #B91C1C; }
      `}</style>

      {dialog.show && (
        <div
          className="ap-dialog-overlay"
          role="alertdialog"
          aria-modal="true"
          onClick={closeDialog}
        >
          <div
            className={`ap-dialog ap-dialog--${dialog.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="ap-dialog-title">
              {dialog.type === 'success' ? 'Success' : 'Something went wrong'}
            </h3>
            <p className="ap-dialog-msg">{dialog.message}</p>
            <button type="button" className="ap-dialog-btn" onClick={closeDialog}>
              OK
            </button>
          </div>
        </div>
      )}

      <div className="ap-wrap">
        <header className="ap-header">
          <p className="ap-eyebrow">Admin · Inventory</p>
          <h1 className="ap-title">Add New Product</h1>
        </header>

        <div className="ap-card">
          <form onSubmit={handleSubmit} className="ap-form">
            <TextInput
              label="Product Name"
              name="name"
              placeholder="e.g. Mustard Yellow Modal"
              value={product.name}
              onChange={handleChange}
              required
            />

            <fieldset className="ap-fieldset">
              <legend className="ap-label">
                Categories <span className="req">*</span>
              </legend>
              <div className="ap-cats">
                {categories.map((category) => {
                  const checked = product.categories.includes(category.value);
                  const isPrimary = product.categories[0] === category.value;

                  return (
                    <div key={category.value} className="ap-cat-row">
                      <label className="ap-cat-label">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCategoryToggle(category.value)}
                        />
                        <span>{category.label}</span>
                      </label>

                      {checked &&
                        (isPrimary ? (
                          <span className="ap-primary-tag">Primary</span>
                        ) : (
                          <button
                            type="button"
                            className="ap-make-primary"
                            onClick={() => makePrimaryCategory(category.value)}
                          >
                            Make primary
                          </button>
                        ))}
                    </div>
                  );
                })}
              </div>
              {product.categories.length > 0 && (
                <p className="ap-cat-summary">
                  {product.categories.length}{' '}
                  {product.categories.length === 1 ? 'category' : 'categories'} selected —{' '}
                  <span style={{ color: '#241C1E' }}>{product.categories.join(', ')}</span>
                </p>
              )}
            </fieldset>

            <div>
              <SelectInput
                label="Color"
                name="color"
                value={product.color}
                onChange={handleChange}
                options={colors}
                required={isColorRequired}
              />
              {isColorRequired ? (
                <p className="ap-hint ap-hint--warn">
                  Color is required when “Georgette Hijabs” is selected
                </p>
              ) : (
                product.categories.length > 0 && (
                  <p className="ap-hint">Color is optional for the selected categories</p>
                )
              )}
            </div>

            <div className="ap-grid-2">
              <TextInput
                label="Current Price (PKR)"
                name="price"
                type="number"
                placeholder="1200"
                value={product.price}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
              <TextInput
                label="Old Price (PKR) — Optional"
                name="oldPrice"
                type="number"
                placeholder="1500"
                value={product.oldPrice}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>

            <UploadImage images={images} setImages={setImages} required />

            <div>
              <label htmlFor="description" className="ap-label">
                Description <span className="req">*</span>
              </label>
              <textarea
                rows={6}
                name="description"
                id="description"
                value={product.description}
                placeholder="Describe the fabric, drape, and care notes…"
                onChange={handleChange}
                className="ap-textarea"
                required
              />
            </div>

            <button type="submit" className="ap-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="ap-submit-inner">
                  <span className="ap-spinner" aria-hidden="true" />
                  Adding product…
                </span>
              ) : (
                'Add Product'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
