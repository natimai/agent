import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { setFilters } from '../../../store/slices/playersSlice';
import { Position } from '../../../types/player';

const PlayerFilters: React.FC = () => {
  const dispatch = useDispatch();
  const [filters, setLocalFilters] = useState({
    position: '',
    minAge: '',
    maxAge: '',
    minValue: '',
    maxValue: '',
    searchQuery: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({
      position: filters.position || undefined,
      ageRange: filters.minAge && filters.maxAge ? 
        [Number(filters.minAge), Number(filters.maxAge)] : undefined,
      valueRange: filters.minValue && filters.maxValue ? 
        [Number(filters.minValue), Number(filters.maxValue)] : undefined,
      searchQuery: filters.searchQuery || undefined,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">חיפוש</label>
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="חפש לפי שם..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">תפקיד</label>
          <select
            name="position"
            value={filters.position}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">הכל</option>
            <option value="GK">שוער</option>
            <option value="DF">הגנה</option>
            <option value="MF">קישור</option>
            <option value="FW">התקפה</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">גיל מינימלי</label>
            <input
              type="number"
              name="minAge"
              value={filters.minAge}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">גיל מקסימלי</label>
            <input
              type="number"
              name="maxAge"
              value={filters.maxAge}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          החל פילטרים
        </button>
      </div>
    </form>
  );
};

export default PlayerFilters; 