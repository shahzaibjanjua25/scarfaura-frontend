import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCards from './ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

/* ------------------------------------------------------------------
   Filter definitions. Category spellings must match the values stored
   in the `categories` array on each product document.
------------------------------------------------------------------- */

const CATEGORIES = [
    { value: 'all', label: 'Everything' },
    { value: 'Printed Hijabs', label: 'Printed Hijabs' },
    { value: 'Georgette Hijabs', label: 'Georgette Hijabs' },
    { value: 'Modal Hijabs', label: 'Modal Hijabs' },
    { value: 'Jersey Hijabs', label: 'Jersey Hijabs' },
    { value: 'Deer Prints', label: 'Deer Prints' },
    { value: 'Leopard Prints', label: 'Leopard Prints' },
];

const COLORS = [
    { name: 'all', hex: null },
    { name: 'black', hex: '#1C1917' },
    { name: 'white', hex: '#FFFFFF' },
    { name: 'beige', hex: '#E7D8C3' },
    { name: 'skin', hex: '#E3C4AC' },
    { name: 'brown', hex: '#7B5334' },
    { name: 'maroon', hex: '#6B1F2A' },
    { name: 'burgundy', hex: '#5A1A2B' },
    { name: 'plum', hex: '#6E3355' },
    { name: 'purple', hex: '#5B4A8A' },
    { name: 'navy blue', hex: '#1F2E52' },
    { name: 'blue', hex: '#3B6EA5' },
    { name: 'green', hex: '#33613F' },
    { name: 'sagegreen', hex: '#9CAA8E' },
    { name: 'grey', hex: '#8E8B87' },
    { name: 'zinc', hex: '#71717A' },
    { name: 'red', hex: '#A32B2B' },
    { name: 'gold', hex: '#C0932F' },
    { name: 'silver', hex: '#C4C4C4' },
];

/* Light swatches need a visible check in a dark colour, dark ones in white. */
const LIGHT_SWATCHES = new Set(['white', 'beige', 'skin', 'silver', 'sagegreen', 'gold']);

const PRICE_RANGES = [
    { label: 'Under PKR 550', min: 0, max: 550 },
    { label: 'PKR 550 – 1,500', min: 550, max: 1500 },
    { label: 'PKR 1,500 – 3,000', min: 1500, max: 3000 },
    { label: 'PKR 3,000 and above', min: 3000, max: null },
];

const SORTS = [
    { value: 'newest', label: 'Newest first' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'rating', label: 'Best rated' },
];

const PER_PAGE = 8;

const INITIAL_FILTERS = { category: 'all', color: 'all', priceIndex: null };

/* ------------------------------------------------------------------
   Filter panel — collapsible sections, shared by rail and drawer.
------------------------------------------------------------------- */

const Section = ({ title, summary, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <section className="sf-section">
            <button
                type="button"
                className="sf-section__head"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                <span className="sf-eyebrow">{title}</span>
                <span className="sf-section__right">
                    {summary && <span className="sf-section__summary">{summary}</span>}
                    <span className={`sf-caret ${open ? 'sf-caret--open' : ''}`} aria-hidden="true" />
                </span>
            </button>
            <div className={`sf-section__body ${open ? 'sf-section__body--open' : ''}`}>
                <div>{children}</div>
            </div>
        </section>
    );
};

const FilterPanel = ({ state, onChange, onClear, activeCount }) => {
    const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));

    return (
        <div className="sf-panel">
            <div className="sf-panel__head">
                <h2 className="sf-display sf-panel__title">Refine</h2>
                <button
                    type="button"
                    onClick={onClear}
                    className="sf-link"
                    disabled={activeCount === 0}
                >
                    Clear all
                </button>
            </div>

            <Section
                title="Fabric & print"
                summary={state.category === 'all' ? null : state.category}
            >
                <ul className="sf-list">
                    {CATEGORIES.map(({ value, label }) => {
                        const active = state.category === value;
                        return (
                            <li key={value}>
                                <button
                                    type="button"
                                    onClick={() => set({ category: value })}
                                    aria-pressed={active}
                                    className={`sf-option ${active ? 'sf-option--on' : ''}`}
                                >
                                    <span className="sf-option__mark" aria-hidden="true" />
                                    {label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </Section>

            <Section
                title="Colour"
                summary={state.color === 'all' ? null : state.color}
            >
                <div className="sf-swatches">
                    {COLORS.map(({ name, hex }) => {
                        const active = state.color === name;
                        if (!hex) {
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => set({ color: name })}
                                    aria-pressed={active}
                                    className={`sf-swatch-all ${active ? 'sf-swatch-all--on' : ''}`}
                                >
                                    All
                                </button>
                            );
                        }
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => set({ color: name })}
                                aria-pressed={active}
                                aria-label={name}
                                title={name}
                                className={`sf-swatch ${active ? 'sf-swatch--on' : ''}`}
                            >
                                <span
                                    className="sf-swatch__dot"
                                    style={{ backgroundColor: hex }}
                                >
                                    {active && (
                                        <svg
                                            viewBox="0 0 20 20"
                                            className={LIGHT_SWATCHES.has(name) ? 'sf-tick sf-tick--dark' : 'sf-tick'}
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M5 10.5l3.2 3.2L15 7"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section
                title="Price"
                summary={state.priceIndex === null ? null : PRICE_RANGES[state.priceIndex].label}
            >
                <ul className="sf-list">
                    <li>
                        <button
                            type="button"
                            onClick={() => set({ priceIndex: null })}
                            aria-pressed={state.priceIndex === null}
                            className={`sf-option ${state.priceIndex === null ? 'sf-option--on' : ''}`}
                        >
                            <span className="sf-option__mark" aria-hidden="true" />
                            Any price
                        </button>
                    </li>
                    {PRICE_RANGES.map((range, i) => {
                        const active = state.priceIndex === i;
                        return (
                            <li key={range.label}>
                                <button
                                    type="button"
                                    onClick={() => set({ priceIndex: i })}
                                    aria-pressed={active}
                                    className={`sf-option ${active ? 'sf-option--on' : ''}`}
                                >
                                    <span className="sf-option__mark" aria-hidden="true" />
                                    {range.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </Section>
        </div>
    );
};

/* ------------------------------------------------------------------ */

const ShopPage = () => {
    const location = useLocation();
    const drawerRef = useRef(null);
    const filterBtnRef = useRef(null);
    const resultsTop = useRef(null);

    const [filtersState, setFiltersState] = useState({
        ...INITIAL_FILTERS,
        category: location.state?.category || 'all',
    });
    const [sort, setSort] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showTop, setShowTop] = useState(false);

    const { category, color, priceIndex } = filtersState;

    const [minPrice, maxPrice] = useMemo(() => {
        if (priceIndex === null) return ['', ''];
        const r = PRICE_RANGES[priceIndex];
        return [r.min, r.max ?? ''];
    }, [priceIndex]);

    const { data, error, isLoading, isFetching } = useFetchAllProductsQuery({
        category: category !== 'all' ? category : '',
        color: color !== 'all' ? color : '',
        minPrice,
        maxPrice,
        sort,
        page: currentPage,
        limit: PER_PAGE,
    });

    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;
    const totalProducts = data?.totalProducts || 0;

    const updateFilters = useCallback((updater) => {
        setFiltersState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
        setCurrentPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        updateFilters({ ...INITIAL_FILTERS });
        setDrawerOpen(false);
    }, [updateFilters]);

    useEffect(() => {
        const incoming = location.state?.category;
        if (incoming && incoming !== filtersState.category) {
            updateFilters((prev) => ({ ...prev, category: incoming }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    /* Drawer: lock scroll, close on Escape, trap Tab, restore focus. */
    useEffect(() => {
        if (!drawerOpen) return undefined;

        const node = drawerRef.current;
        const selector =
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        const onKey = (e) => {
            if (e.key === 'Escape') {
                setDrawerOpen(false);
                return;
            }
            if (e.key !== 'Tab' || !node) return;
            const items = Array.from(node.querySelectorAll(selector));
            if (!items.length) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        const t = window.setTimeout(() => node?.querySelector(selector)?.focus(), 60);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
            window.clearTimeout(t);
            filterBtnRef.current?.focus();
        };
    }, [drawerOpen]);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 700);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const activeChips = useMemo(() => {
        const chips = [];
        if (category !== 'all') chips.push({ key: 'category', label: category, reset: { category: 'all' } });
        if (color !== 'all') chips.push({ key: 'color', label: color, reset: { color: 'all' } });
        if (priceIndex !== null) {
            chips.push({ key: 'price', label: PRICE_RANGES[priceIndex].label, reset: { priceIndex: null } });
        }
        return chips;
    }, [category, color, priceIndex]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        resultsTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    /* Windowed pager with first/last anchors and ellipses. */
    const pageItems = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const items = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
        const sorted = [...items].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
        const out = [];
        sorted.forEach((n, i) => {
            if (i > 0 && n - sorted[i - 1] > 1) out.push(`gap-${n}`);
            out.push(n);
        });
        return out;
    }, [currentPage, totalPages]);

    const firstIndex = products.length ? (currentPage - 1) * PER_PAGE + 1 : 0;
    const lastIndex = products.length ? firstIndex + products.length - 1 : 0;

    const panel = (
        <FilterPanel
            state={filtersState}
            onChange={updateFilters}
            onClear={clearFilters}
            activeCount={activeChips.length}
        />
    );

    const sortControl = (
        <label className="sf-sort">
            <span className="sf-sort__label">Sort</span>
            <select
                value={sort}
                onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                }}
                className="sf-sort__select"
            >
                {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                        {s.label}
                    </option>
                ))}
            </select>
            <span className="sf-caret sf-caret--open" aria-hidden="true" />
        </label>
    );

    return (
        <div className="sf-shop">
            <style>{TOKENS}</style>

            <header className="sf-masthead">
                <div className="sf-wrap">
                    <p className="sf-eyebrow">The Collection</p>
                    <h1 className="sf-display sf-masthead__title">
                        Hijabs cut for<em> everyday wear</em>
                    </h1>
                    <p className="sf-masthead__lede">
                        Modal, jersey and georgette, dyed in small runs. Filter by fabric,
                        colour or price to find the drape you're after.
                    </p>
                </div>

                {/* Edit these three to match your real policy before launch. */}
                <div className="sf-wrap">
                    <ul className="sf-assurances">
                        <li>Cash on delivery across Pakistan</li>
                        <li>Free delivery over PKR 3,000</li>
                        {/* <li>7-day exchange</li> */}
                    </ul>
                </div>
            </header>

            <div className="sf-wrap sf-layout">
                <aside className="sf-rail">{panel}</aside>

                <main className="sf-results" ref={resultsTop}>
                    <div className="sf-toolbar">
                        <p className="sf-count" aria-live="polite">
                            {isLoading ? (
                                <span className="sf-count__of">Loading the collection</span>
                            ) : totalProducts > 0 ? (
                                <>
                                    <span className="sf-count__num">{firstIndex}–{lastIndex}</span>
                                    <span className="sf-count__of"> of {totalProducts} pieces</span>
                                </>
                            ) : (
                                <span className="sf-count__of">No pieces</span>
                            )}
                        </p>

                        <div className="sf-toolbar__right">
                            {sortControl}
                            <button
                                type="button"
                                ref={filterBtnRef}
                                onClick={() => setDrawerOpen(true)}
                                className="sf-filter-btn"
                            >
                                Filters
                                {activeChips.length > 0 && (
                                    <span className="sf-filter-btn__badge">{activeChips.length}</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {activeChips.length > 0 && (
                        <ul className="sf-chips">
                            {activeChips.map((chip) => (
                                <li key={chip.key}>
                                    <button
                                        type="button"
                                        onClick={() => updateFilters((p) => ({ ...p, ...chip.reset }))}
                                        className="sf-chip"
                                    >
                                        <span className="capitalize">{chip.label}</span>
                                        <span className="sf-chip__x" aria-hidden="true">×</span>
                                        <span className="sr-only">Remove filter</span>
                                    </button>
                                </li>
                            ))}
                            {activeChips.length > 1 && (
                                <li>
                                    <button type="button" onClick={clearFilters} className="sf-chip sf-chip--clear">
                                        Clear all
                                    </button>
                                </li>
                            )}
                        </ul>
                    )}

                    {isLoading ? (
                        <div className="sf-grid" aria-busy="true">
                            {Array.from({ length: PER_PAGE }).map((_, i) => (
                                <div key={i} className="sf-skeleton" style={{ animationDelay: `${i * 60}ms` }}>
                                    <div className="sf-skeleton__img" />
                                    <div className="sf-skeleton__line" style={{ width: '70%' }} />
                                    <div className="sf-skeleton__line" style={{ width: '40%' }} />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="sf-notice">
                            <h3 className="sf-display sf-notice__title">The collection didn't load</h3>
                            <p>
                                {error?.data?.message ||
                                    error?.error ||
                                    'The server did not respond. Check your connection and try again.'}
                            </p>
                            <button type="button" onClick={() => window.location.reload()} className="sf-btn">
                                Try again
                            </button>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div
                                key={`${category}-${color}-${priceIndex}-${sort}-${currentPage}`}
                                className={`sf-fade ${isFetching ? 'sf-dim' : ''}`}
                            >
                                <ProductCards products={products} />
                            </div>

                            {totalPages > 1 && (
                                <nav className="sf-pager" aria-label="Pagination">
                                    <button
                                        type="button"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="sf-pager__step"
                                    >
                                        Previous
                                    </button>
                                    <ol className="sf-pager__nums">
                                        {pageItems.map((item) =>
                                            typeof item === 'string' ? (
                                                <li key={item} className="sf-pager__gap" aria-hidden="true">…</li>
                                            ) : (
                                                <li key={item}>
                                                    <button
                                                        type="button"
                                                        onClick={() => goToPage(item)}
                                                        aria-current={item === currentPage ? 'page' : undefined}
                                                        aria-label={`Page ${item}`}
                                                        className={`sf-pager__num ${item === currentPage ? 'sf-pager__num--on' : ''}`}
                                                    >
                                                        {item}
                                                    </button>
                                                </li>
                                            )
                                        )}
                                    </ol>
                                    <button
                                        type="button"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="sf-pager__step"
                                    >
                                        Next
                                    </button>
                                </nav>
                            )}
                        </>
                    ) : (
                        <div className="sf-notice sf-notice--empty">
                            <h3 className="sf-display sf-notice__title">Nothing matches this combination</h3>
                            <p>Try a wider price band, or clear the filters to see everything.</p>
                            <button type="button" onClick={clearFilters} className="sf-btn">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile drawer */}
            <div
                className={`sf-scrim ${drawerOpen ? 'sf-scrim--on' : ''}`}
                onClick={() => setDrawerOpen(false)}
                aria-hidden="true"
            />
            <div
                ref={drawerRef}
                className={`sf-drawer ${drawerOpen ? 'sf-drawer--on' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Filters"
            >
                <div className="sf-drawer__head">
                    <span className="sf-eyebrow">Filters</span>
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(false)}
                        className="sf-drawer__close"
                        aria-label="Close filters"
                    >
                        ×
                    </button>
                </div>
                <div className="sf-drawer__body">{panel}</div>
                <div className="sf-drawer__foot">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="sf-btn sf-btn--block">
                        Show {totalProducts} {totalProducts === 1 ? 'piece' : 'pieces'}
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`sf-top ${showTop ? 'sf-top--on' : ''}`}
                aria-label="Back to top"
            >
                ↑
            </button>
        </div>
    );
};

/* ------------------------------------------------------------------
   Tokens, scoped under .sf-shop. Change --sf-nav if your header
   height changes; it drives both page padding and sticky offsets.
------------------------------------------------------------------- */

const TOKENS = `
.sf-shop {
  --sf-nav:    80px;
  --sf-ink:    #241C1E;
  --sf-paper:  #FAF7F5;
  --sf-card:   #FFFFFF;
  --sf-plum:   #5A1A2B;
  --sf-rule:   #E7DFDA;
  --sf-muted:  #8A7F7B;
  --sf-hush:   #F2ECE8;

  background: var(--sf-paper);
  color: var(--sf-ink);
  font-family: 'Karla', ui-sans-serif, system-ui, sans-serif;
  padding-top: var(--sf-nav);
  -webkit-font-smoothing: antialiased;
}
.sf-wrap { max-width: 1280px; margin: 0 auto; padding: 0 1.25rem; }
@media (min-width: 900px) { .sf-wrap { padding: 0 2.5rem; } }
.sf-display { font-family: 'Fraunces', 'Iowan Old Style', Georgia, serif; font-weight: 500; letter-spacing: -0.015em; }
.sf-eyebrow { font-size: 0.688rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--sf-muted); font-weight: 600; }
.sf-shop .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* Masthead */
.sf-masthead { padding: 2.5rem 0 0; }
.sf-masthead__title { font-size: clamp(2.25rem, 5.5vw, 4rem); line-height: 1.04; margin: 0.6rem 0 0; max-width: 15ch; }
.sf-masthead__title em { font-style: italic; color: var(--sf-plum); }
.sf-masthead__lede { margin-top: 1.25rem; max-width: 46ch; color: var(--sf-muted); line-height: 1.7; }
.sf-assurances {
  display: flex; flex-wrap: wrap; gap: 0.5rem 1.75rem; list-style: none;
  margin: 2.5rem 0 0; padding: 1rem 0; font-size: 0.813rem; color: var(--sf-muted);
  border-top: 1px solid var(--sf-rule); border-bottom: 1px solid var(--sf-rule);
}
.sf-assurances li { position: relative; padding-left: 1.1rem; }
.sf-assurances li::before {
  content: ''; position: absolute; left: 0; top: 0.45em;
  width: 5px; height: 5px; border-radius: 999px; background: var(--sf-plum); opacity: 0.55;
}

/* Layout */
.sf-layout { display: grid; grid-template-columns: 1fr; gap: 0; padding-top: 2rem; padding-bottom: 5rem; }
.sf-rail { display: none; }
@media (min-width: 900px) {
  .sf-layout { grid-template-columns: 236px 1fr; gap: 4.5rem; padding-top: 3rem; }
  .sf-rail {
    display: block; align-self: start;
    position: sticky; top: calc(var(--sf-nav) + 1.5rem);
    max-height: calc(100vh - var(--sf-nav) - 3rem); overflow-y: auto;
    padding-right: 0.5rem;
  }
  .sf-rail::-webkit-scrollbar { width: 3px; }
  .sf-rail::-webkit-scrollbar-thumb { background: var(--sf-rule); }
}

/* Panel + sections */
.sf-panel__head { display: flex; align-items: baseline; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid var(--sf-ink); }
.sf-panel__title { font-size: 1.5rem; margin: 0; }
.sf-section { border-bottom: 1px solid var(--sf-rule); }
.sf-section__head {
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  width: 100%; padding: 1.15rem 0; background: none; border: 0; cursor: pointer; text-align: left;
}
.sf-section__right { display: flex; align-items: center; gap: 0.6rem; min-width: 0; }
.sf-section__summary {
  font-size: 0.75rem; color: var(--sf-plum); text-transform: capitalize;
  max-width: 9ch; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sf-caret {
  width: 7px; height: 7px; flex: none; border-right: 1.5px solid var(--sf-muted); border-bottom: 1.5px solid var(--sf-muted);
  transform: rotate(-45deg); transition: transform 0.2s ease; margin-bottom: 2px;
}
.sf-caret--open { transform: rotate(45deg); margin-bottom: 0; }
.sf-section__body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.24s ease; }
.sf-section__body--open { grid-template-rows: 1fr; }
.sf-section__body > div { overflow: hidden; }
.sf-section__body--open > div { padding-bottom: 1.35rem; }

.sf-list { list-style: none; margin: 0; padding: 0; }
.sf-option {
  display: flex; align-items: center; gap: 0.65rem; width: 100%;
  padding: 0.4rem 0; background: none; border: 0; cursor: pointer;
  font-size: 0.938rem; text-align: left; color: var(--sf-muted); transition: color 0.15s ease;
}
.sf-option__mark {
  width: 0.375rem; height: 0.375rem; border-radius: 999px; flex: none;
  background: transparent; border: 1px solid var(--sf-rule); transition: all 0.15s ease;
}
.sf-option:hover { color: var(--sf-ink); }
.sf-option:hover .sf-option__mark { border-color: var(--sf-muted); }
.sf-option--on { color: var(--sf-ink); font-weight: 600; }
.sf-option--on .sf-option__mark { background: var(--sf-plum); border-color: var(--sf-plum); box-shadow: 0 0 0 3px rgba(90,26,43,0.12); }

/* Swatches */
.sf-swatches { display: flex; flex-wrap: wrap; gap: 0.55rem; }
.sf-swatch { padding: 2px; border: 1px solid transparent; border-radius: 999px; background: none; cursor: pointer; line-height: 0; transition: border-color 0.15s ease, transform 0.15s ease; }
.sf-swatch:hover { transform: scale(1.08); }
.sf-swatch__dot {
  display: grid; place-items: center; width: 1.625rem; height: 1.625rem; border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.13);
}
.sf-swatch--on { border-color: var(--sf-ink); }
.sf-tick { width: 0.875rem; height: 0.875rem; color: #fff; }
.sf-tick--dark { color: var(--sf-ink); }
.sf-swatch-all {
  height: calc(1.625rem + 6px); padding: 0 0.75rem; border-radius: 999px;
  border: 1px solid var(--sf-rule); background: none; font-size: 0.75rem; cursor: pointer; color: var(--sf-muted);
}
.sf-swatch-all--on { border-color: var(--sf-ink); color: var(--sf-ink); font-weight: 600; }

.sf-link { background: none; border: 0; padding: 0; cursor: pointer; font-size: 0.813rem; color: var(--sf-plum); text-decoration: underline; text-underline-offset: 3px; }
.sf-link:disabled { color: var(--sf-muted); opacity: 0.5; cursor: default; text-decoration: none; }

/* Toolbar — sticky on mobile so filters stay in reach */
.sf-toolbar {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.85rem 0; border-bottom: 1px solid var(--sf-rule);
  position: sticky; top: var(--sf-nav); z-index: 20;
  background: rgba(250,247,245,0.92); backdrop-filter: blur(8px);
}
@media (min-width: 900px) { .sf-toolbar { position: static; background: none; backdrop-filter: none; padding-top: 0; } }
.sf-toolbar__right { display: flex; align-items: center; gap: 0.75rem; }
.sf-count { font-size: 0.875rem; margin: 0; }
.sf-count__num { font-variant-numeric: tabular-nums; font-weight: 600; }
.sf-count__of { color: var(--sf-muted); }

.sf-sort { display: inline-flex; align-items: center; gap: 0.4rem; position: relative; cursor: pointer; }
.sf-sort__label { display: none; font-size: 0.688rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sf-muted); }
@media (min-width: 560px) { .sf-sort__label { display: inline; } }
.sf-sort__select {
  appearance: none; -webkit-appearance: none; background: none; border: 0;
  font: inherit; font-size: 0.875rem; color: var(--sf-ink); cursor: pointer;
  padding: 0.4rem 1.1rem 0.4rem 0.25rem; border-bottom: 1px solid var(--sf-rule);
}
.sf-sort__select:hover { border-bottom-color: var(--sf-ink); }
.sf-sort .sf-caret { position: absolute; right: 3px; pointer-events: none; }

.sf-filter-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  border: 1px solid var(--sf-ink); border-radius: 999px;
  padding: 0.45rem 1rem; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase;
  background: transparent; cursor: pointer;
}
.sf-filter-btn__badge { background: var(--sf-plum); color: #fff; border-radius: 999px; min-width: 1.15rem; height: 1.15rem; display: grid; place-items: center; font-size: 0.688rem; }
@media (min-width: 900px) { .sf-filter-btn { display: none; } }

/* Chips */
.sf-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; padding: 1.25rem 0 0; margin: 0; }
.sf-chip {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--sf-card); border: 1px solid var(--sf-rule); border-radius: 999px;
  padding: 0.4rem 0.9rem; font-size: 0.813rem; cursor: pointer; color: var(--sf-ink);
  transition: border-color 0.15s ease, background 0.15s ease;
}
.sf-chip:hover { border-color: var(--sf-ink); }
.sf-chip__x { color: var(--sf-muted); font-size: 1rem; line-height: 1; }
.sf-chip:hover .sf-chip__x { color: var(--sf-plum); }
.sf-chip--clear { background: none; border-style: dashed; color: var(--sf-muted); }

/* Grid, skeletons, transitions */
.sf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.75rem; padding-top: 2rem; }
.sf-skeleton { animation: sf-pulse 1.4s ease-in-out infinite; }
.sf-skeleton__img { aspect-ratio: 3 / 4; background: var(--sf-hush); border-radius: 12px; }
.sf-skeleton__line { height: 0.625rem; background: var(--sf-hush); margin-top: 0.75rem; border-radius: 6px; }
@keyframes sf-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
.sf-fade { animation: sf-rise 0.32s ease both; padding-top: 0.5rem; }
@keyframes sf-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.sf-dim { opacity: 0.4; transition: opacity 0.2s ease; }

/* Notices */
.sf-notice { text-align: center; padding: 5rem 1.5rem; }
.sf-notice__title { font-size: 1.5rem; margin: 0; }
.sf-notice p { margin: 0.75rem auto 0; max-width: 42ch; color: var(--sf-muted); line-height: 1.65; }
.sf-notice--empty { border: 1px solid var(--sf-rule); margin-top: 2rem; background: var(--sf-card); border-radius: 12px; }
.sf-btn {
  margin-top: 1.75rem; display: inline-block; background: var(--sf-ink); color: var(--sf-paper);
  border: 0; padding: 0.85rem 1.85rem; font-size: 0.75rem; letter-spacing: 0.1em;
  text-transform: uppercase; cursor: pointer; border-radius: 8px; transition: background 0.18s ease;
}
.sf-btn:hover { background: var(--sf-plum); }
.sf-btn--block { display: block; width: 100%; margin-top: 0; }

/* Pager */
.sf-pager { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding-top: 3.5rem; flex-wrap: wrap; }
.sf-pager__nums { display: flex; align-items: center; gap: 0.15rem; list-style: none; margin: 0; padding: 0; }
.sf-pager__gap { color: var(--sf-muted); padding: 0 0.25rem; }
.sf-pager__num {
  min-width: 2.25rem; height: 2.25rem; border: 0; background: none; cursor: pointer;
  font-variant-numeric: tabular-nums; color: var(--sf-muted); border-radius: 6px; transition: color 0.15s ease;
}
.sf-pager__num:hover { color: var(--sf-ink); }
.sf-pager__num--on { color: var(--sf-ink); font-weight: 700; box-shadow: inset 0 -2px 0 var(--sf-plum); }
.sf-pager__step { background: none; border: 0; cursor: pointer; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sf-ink); }
.sf-pager__step:disabled { opacity: 0.28; cursor: not-allowed; }

/* Drawer */
.sf-scrim { position: fixed; inset: 0; background: rgba(36,28,30,0.42); opacity: 0; pointer-events: none; transition: opacity 0.25s ease; z-index: 60; }
.sf-scrim--on { opacity: 1; pointer-events: auto; }
.sf-drawer {
  position: fixed; inset: 0 0 0 auto; width: min(370px, 89vw);
  background: var(--sf-paper); z-index: 70; transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  display: flex; flex-direction: column; box-shadow: -8px 0 40px rgba(36,28,30,0.1);
}
.sf-drawer--on { transform: translateX(0); }
.sf-drawer__head { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-bottom: 1px solid var(--sf-rule); }
.sf-drawer__close { background: none; border: 0; font-size: 1.75rem; line-height: 1; cursor: pointer; color: var(--sf-ink); }
.sf-drawer__body { flex: 1; overflow-y: auto; padding: 1.25rem; -webkit-overflow-scrolling: touch; }
.sf-drawer__foot { padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom)); border-top: 1px solid var(--sf-rule); background: var(--sf-card); }
@media (min-width: 900px) { .sf-drawer, .sf-scrim { display: none; } }

/* Back to top */
.sf-top {
  position: fixed; right: 1.25rem; bottom: 1.5rem; z-index: 30;
  width: 2.75rem; height: 2.75rem; border-radius: 999px;
  background: var(--sf-ink); color: var(--sf-paper); border: 0; cursor: pointer;
  opacity: 0; pointer-events: none; transform: translateY(8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.sf-top--on { opacity: 1; pointer-events: auto; transform: none; }
.sf-top:hover { background: var(--sf-plum); }

/* Focus + motion */
.sf-shop :focus-visible { outline: 2px solid var(--sf-plum); outline-offset: 3px; border-radius: 4px; }
@media (prefers-reduced-motion: reduce) {
  .sf-shop *, .sf-drawer, .sf-scrim, .sf-fade, .sf-skeleton { animation: none !important; transition-duration: 0.01ms !important; }
}
`;

export default ShopPage;