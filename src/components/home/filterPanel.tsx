import React from "react";

type SortField = "name" | "date" | "type" | "size";
type SortOrder = "asc" | "desc";
type FilterType = "all" | "folders" | "documents";
type FilterDate = "all" | "today" | "week" | "month" | "year";

interface FilterPanelProps {
  theme: any;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  filterDate: FilterDate;
  setFilterDate: (date: FilterDate) => void;
  setSearchTerm: (term: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  theme,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  filterType,
  setFilterType,
  filterDate,
  setFilterDate,
  setSearchTerm,
}) => (
  <div className={`mt-4 p-4 ${theme.cardBg} ${theme.border} border rounded-lg`}>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Sort by</label>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as SortField)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
        >
          <option value="name">Name</option>
          <option value="date">Date Modified</option>
          <option value="type">Type</option>
          <option value="size">Size</option>
        </select>
      </div>
      <div>
        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Item Type</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
        >
          <option value="all">All Items</option>
          <option value="folders">Folders Only</option>
          <option value="documents">Documents Only</option>
        </select>
      </div>
      <div>
        <label className={`block text-sm font-medium ${theme.text} mb-1`}>Date Range</label>
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value as FilterDate)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.input}`}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div className="flex items-end">
        <button
          onClick={() => {
            setSortField("name");
            setSortOrder("asc");
            setFilterType("all");
            setFilterDate("all");
            setSearchTerm("");
          }}
          className={`px-4 py-2 ${theme.textSecondary} ${theme.hover} rounded-lg`}
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
);

export default FilterPanel;