# ⚡ React Performance

<img width="1920" height="915" alt="image" src="https://github.com/user-attachments/assets/6f033137-9813-4481-8cc3-b1c3fd606641" />

🔗 [Live Application (Deploy)](https://react-performance-rss.netlify.app/)


**React Performance** is a CO₂ emissions data explorer, intentionally built from an unoptimized starter and then surgically optimized using React profiling techniques. Developed as a task for the **[RS School](https://rs.school/)** Frontend course, it demonstrates deep understanding of React rendering behavior, memoization strategies, and list virtualization.

This project goes beyond applying a few `useMemo` calls; it features a complete profiling workflow with **before/after measurements**, strategic `React.memo` boundaries, `useCallback` for stable handler references, `useMemo` for expensive computations, `Map`-based O(1) data lookups, and **react-window** virtualization for rendering 200+ country cards with zero jank — achieving an **87.9% average render time reduction**.

> 📋 **Task Description & Rules:**
> You can find the detailed technical requirements here: [RS School React Performance Task](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/performance/performance.md)

-----

## 🏗️ Technical Architecture

The project is structured to ensure clean separation of concerns and maximum component isolation:

```
src/
├── components/
│   ├── app/             → Root container: state management, controls layout, data orchestration
│   ├── column-modal/    → Column visibility toggle panel with memoized checkboxes
│   ├── country-card/    → Individual country display with Map-based O(1) data lookups
│   ├── country-list/    → Virtualized scrollable list via react-window + AutoSizer
│   ├── data-table/      → Dynamic key-value table with configurable column rendering
│   ├── loading-spinner/ → Full-screen loading indicator during initial data fetch
│   ├── search-bar/      → Memoized search input for real-time country filtering
│   └── year-selector/   → Memoized year dropdown populated from dataset
├── hooks/
│   └── useCo2Data.ts    → Custom hook: fetches & processes 88 MB OWID CO₂ JSON dataset
├── types/
│   └── index.ts         → TypeScript definitions: YearData (40+ metrics), Country, ColumnOption
└── utils/
    ├── data-transformers.ts → Pure functions: Map creation, year extraction, population/CO₂ getters
    └── format-utils.ts      → Intl.NumberFormat wrapper with graceful null/undefined handling
```

  * **Layered Memoization Strategy:** Every component that receives props from the parent `App` is wrapped in `React.memo`. Expensive computations (filtering, sorting, year data mapping) use `useMemo`. All event handlers passed down the tree use `useCallback` with stable dependency arrays — ensuring children only re-render when their actual data changes.
  * **O(1) Data Lookups with Map:** Instead of scanning arrays with `.find()` on every render, `createYearDataMap()` converts `YearData[]` into a `Map<number, YearData>`, providing constant-time access to population, CO₂, and other metrics by year.
  * **Virtualized Rendering:** The `CountryList` component renders 200+ country cards through `react-window` `FixedSizeList` with `react-virtualized-auto-sizer`, mounting only the cards visible in the viewport. This alone reduced column toggle render time from **581.7 ms → 19.5 ms** (96.6% improvement).
  * **88 MB Dataset Processing:** The application loads and processes the full **Our World in Data (OWID)** CO₂ dataset (~88 MB JSON) containing historical emissions data for every country since 1750. The `useCo2Data` hook handles the fetch, parsing, and transformation in a single `useEffect` lifecycle.
  * **CSS Modules Scoping:** All component styles use CSS Modules (`*.module.css`) to guarantee zero class name collisions and fully scoped styling.

-----

## ✨ Key Features

### 🔍 Data Exploration

  * **Country Search:** Real-time filtering by country name with instant results.
  * **Year Selection:** Dropdown populated dynamically from all available years in the dataset (1750–2023).
  * **Sorting:** Sort countries by name (alphabetical) or by population, with toggleable ascending/descending order.
  * **Column Configuration:** Modal panel to show/hide any of 19 data columns (CO₂, methane, nitrous oxide, GHG, per-capita metrics, sector breakdowns, etc.).

### 🃏 Country Cards

  * Each card displays: country name, ISO code badge, population, total CO₂ emissions.
  * Embedded data table with user-selected columns and locale-formatted numbers.
  * Graceful handling of missing data with `N/A` fallbacks.

### ⚡ Performance Optimizations Applied

  * **`useMemo`** — Memoized computed values: filtered countries, sorted countries, available years, year data maps, population lookups, row data objects.
  * **`useCallback`** — Stable handler references: sort toggle, column toggle, modal toggle, year change.
  * **`React.memo`** — Component-level memoization: `SearchBar`, `YearSelector`, `ColumnModal`, `CountryCard`, `CountryList`, `DataTable`.
  * **Proper key props** — Unique, stable keys for all list renders and table rows.
  * **Virtualization** — `react-window` (`FixedSizeList`) + `react-virtualized-auto-sizer` (`AutoSizer`) for the country card list.

-----

## 📊 Performance Results

Profiled with **React DevTools Profiler** in development mode. Full report with flame chart screenshots available in [`PERFORMANCE.md`](./PERFORMANCE.md).

| Interaction      | Baseline (ms) | Optimized (ms) | Improvement |
|:-----------------|:--------------|:---------------|:------------|
| Sort countries   | 500.8         | 75.4           | **84.9%**   |
| Search countries | 189.8         | 31.3           | **83.5%**   |
| Change year      | 498.4         | 88.8           | **82.2%**   |
| Toggle column    | 581.7         | 19.5           | **96.6%**   |
| **Average**      | **442.7**     | **53.8**       | **87.9%**   |

-----

## 💻 Tech Stack

  * **Core:** React 19, TypeScript 5.9
  * **Virtualization:** react-window 2, react-virtualized-auto-sizer 2
  * **Profiling:** React DevTools Profiler, react-scan
  * **Styling:** CSS Modules
  * **Build Tool:** Vite 7
  * **Linting:** ESLint 9 (TypeScript + React Hooks + React Refresh), Prettier
  * **Data Source:** Our World in Data (OWID) CO₂ Dataset (~88 MB JSON)

-----

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/FierceSloth/react-performance.git

# Navigate to the project
cd react-performance

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

| Script           | Description                             |
|:-----------------|:----------------------------------------|
| `npm run dev`    | Start Vite dev server with HMR          |
| `npm run build`  | Type-check and build for production     |
| `npm run preview`| Preview production build locally        |
| `npm run lint`   | Run ESLint on source files              |
| `npm run lint:fix`| Auto-fix ESLint issues                 |
| `npm run format` | Format all files with Prettier          |
