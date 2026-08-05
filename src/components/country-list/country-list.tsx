import { memo, useMemo } from 'react';
import { AutoSizer } from 'react-virtualized-auto-sizer';
import { List } from 'react-window';
import type { Country } from '../../types';
import { createYearDataMap, getPopulationForYear } from '../../utils/data-transformers';
import { CountryCard } from '../country-card/country-card';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

type RowDataProps = {
  sortedCountries: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

type CountryRowProps = RowDataProps & {
  index: number;
  style: React.CSSProperties;
};

type RenderProps = {
  height: number | undefined;
  width: number | undefined;
};

const Row = ({ index, style, sortedCountries, selectedYear, selectedColumns }: CountryRowProps) => {
  const country = sortedCountries[index];

  return (
    <div style={style}>
      <CountryCard
        country={country}
        selectedYear={selectedYear}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export const CountryList = memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const filteredCountries = useMemo(() => {
      return countries.filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      });
    }, [countries, searchQuery]);

    const sortedCountries = useMemo(() => {
      return [...filteredCountries].sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        } else {
          const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
          const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        }
      });
    }, [filteredCountries, selectedYear, sortField, sortOrder]);

    const rowData = useMemo(
      () => ({
        sortedCountries,
        selectedYear,
        selectedColumns,
      }),
      [sortedCountries, selectedYear, selectedColumns]
    );

    return (
      <div className={styles.countryList}>
        <AutoSizer
          renderProp={({ height, width }: RenderProps) => {
            if (height === undefined || width === undefined) {
              return null;
            }
            return (
              <List<RowDataProps>
                style={{ height, width }}
                rowCount={sortedCountries.length}
                rowHeight={300}
                rowComponent={Row}
                rowProps={rowData}
              />
            );
          }}
        />
      </div>
    );
  }
);
