import type { Country } from '../../types';
import {
  createYearDataMap,
  getCo2ForYear,
  getPopulationForYear,
} from '../../utils/data-transformers';
import { formatNumber } from '../../utils/format-utils';
import { DataTable } from '../data-table/data-table';

import { memo } from 'react';
import styles from './country-card.module.css';

type CountryCardProps = {
  country: Country;
  selectedYear: number;
  selectedColumns: string[];
};

export const CountryCard = memo(({ country, selectedYear, selectedColumns }: CountryCardProps) => {
  const yearDataMap = createYearDataMap(country.data);
  const population = getPopulationForYear(yearDataMap, selectedYear);
  const co2 = getCo2ForYear(yearDataMap, selectedYear);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{country.id}</h3>
        {country.iso_code && <span className={styles.isoCode}>{country.iso_code}</span>}
      </div>

      <div className={styles.stats}>
        <div>
          Population ({selectedYear}): {formatNumber(population)}
        </div>
        <div>
          CO₂ Emissions ({selectedYear}): {formatNumber(co2)} tonnes
        </div>
      </div>

      <DataTable data={country.data} year={selectedYear} columns={selectedColumns} />
    </div>
  );
});
