import { useCallback, useMemo, useState } from 'react';
import { useCo2Data } from '../../hooks/useCo2Data';
import { getAvailableColumns, getAvailableYears } from '../../utils/data-transformers';
import { ColumnModal } from '../column-modal/column-modal';
import { CountryList } from '../country-list/country-list';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { SearchBar } from '../search-bar/search-bar';
import { YearSelector } from '../year-selector/year-selector';

import styles from './app.module.css';

export const App = () => {
  const { data, isLoading, error } = useCo2Data();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState(2020);
  const [sortField, setSortField] = useState<'name' | 'population'>('population');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'year',
    'population',
    'co2',
    'co2_per_capita',
  ]);

  const years = useMemo(() => (data ? getAvailableYears(data) : []), [data]);
  const availableColumns = getAvailableColumns();

  const handleSortOrderToggle = useCallback(() => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleColumnToggle = useCallback((column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  }, []);

  const handleModalToggle = useCallback(() => {
    setIsColumnModalOpen((prev) => !prev);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.errorMessage}>Error: {error}</div>;
  }

  if (!data) {
    return <div className={styles.noDataMessage}>No data available</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CO₂ Emissions Data Explorer</h1>

      {/* Controls */}
      <div className={styles.controls}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <YearSelector year={selectedYear} years={years} onChange={setSelectedYear} />

        <div className={styles.sortContainer}>
          <label className={styles.sortLabel}>Sort by:</label>
          <select
            value={sortField}
            onChange={(event) => setSortField(event.target.value as 'name' | 'population')}
            className={styles.sortSelect}
          >
            <option value="population">Population</option>
            <option value="name">Name</option>
          </select>

          <button onClick={handleSortOrderToggle} className={styles.sortButton}>
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className={styles.columnButtonContainer}>
          <button onClick={handleModalToggle} className={styles.columnButton}>
            Select columns ({selectedColumns.length} selected)
          </button>
        </div>
      </div>

      {/* Country List */}
      <CountryList
        countries={data}
        searchQuery={searchQuery}
        selectedColumns={selectedColumns}
        selectedYear={selectedYear}
        sortField={sortField}
        sortOrder={sortOrder}
        onYearChange={setSelectedYear}
      />

      {/* Column Modal */}
      <ColumnModal
        isOpen={isColumnModalOpen}
        availableColumns={availableColumns}
        selectedColumns={selectedColumns}
        onToggle={handleColumnToggle}
        onClose={handleModalToggle}
      />
    </div>
  );
};
