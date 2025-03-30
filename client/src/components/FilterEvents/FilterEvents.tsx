import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { filterState } from "../../recoil";

const locationOptions = [
  { value: "Australia", label: "Australia" },
  { value: "Canada", label: "Canada" },
  { value: "China", label: "China" },
  { value: "France", label: "France" },
  { value: "Germany", label: "Germany" },
  { value: "India", label: "India" },
  { value: "Japan", label: "Japan" },
  { value: "South Korea", label: "South Korea" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "United States", label: "United States" },
];

const categoryOptions = [
  { value: "Art", label: "Art" },
  { value: "Business", label: "Business" },
  { value: "Education", label: "Education" },
  { value: "Health", label: "Health" },
  { value: "Music", label: "Music" },
  { value: "Science", label: "Science" },
  { value: "Sports", label: "Sports" },
  { value: "Technology", label: "Technology" },
  { value: "Travel", label: "Travel" },
  { value: "Wellness", label: "Wellness" },
];

const eventTypeOptions = [
  { value: "Conference", label: "Conference" },
  { value: "Exhibition", label: "Exhibition" },
  { value: "Hackathon", label: "Hackathon" },
  { value: "Meetup", label: "Meetup" },
  { value: "Networking", label: "Networking" },
  { value: "Panel Discussion", label: "Panel Discussion" },
  { value: "Seminar", label: "Seminar" },
  { value: "Training", label: "Training" },
  { value: "Webinar", label: "Webinar" },
  { value: "Workshop", label: "Workshop" },
];

const defaultFilters = {
  title: "",
  location: [],
  category: [],
  type: [],
  price: { min_price: "", max_price: "" },
  date: { start_date: "", end_date: "" },
};

function FilterEvents({
  setFilterApplied,
  setPage,
}: {
  setFilterApplied: Dispatch<SetStateAction<boolean>>;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  const [filters, setFilters] = useRecoilState(filterState);
  const [filterVisible, setFilterVisible] = useState(false);
  const contRef = useRef<HTMLDivElement>(null);

  const checkClickOutside = (e: MouseEvent) => {
    if (contRef.current && !contRef.current.contains(e.target as Node)) {
      setFilterVisible(false);
    }
  };

  useEffect(() => {
    if (filterVisible) {
      document.addEventListener("mousedown", checkClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", checkClickOutside);
    };
  }, [filterVisible]);

  const handleSelectChange = (selectedOptions: any, name: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: selectedOptions
        ? selectedOptions.map((option: any) => option.value)
        : [],
    }));
  };

  const handleFilterToggle = () => {
    setFilterVisible(!filterVisible);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setFilterApplied(!filterVisible);
  };

  return (
    <div>
      <section id="filterSection" className="bg-neutral-100 py-8 px-4 pt-20">
        <div className="max-w-[76rem] mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6" ref={contRef}>
            <div
              className="flex justify-between items-center cursor-pointer"
              id="filterToggle"
              onClick={handleFilterToggle}
            >
              <h2 className="text-2xl font-bold font-montserrat text-[#212529] select-none">
                Filter Events
              </h2>
              <button
                className="text-[#007bff] transition-transform duration-300"
                id="toggleButton"
              >
                {filterVisible ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div
              className={`filter-content mt-6 ${filterVisible ? "" : "hidden"}`}
              id="filterContent"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Search Bar */}
                <div className="space-y-2">
                  <label className="block text-[#212529] font-medium">
                    Search Events
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none"
                    placeholder="Search by title or description"
                    value={filters.title}
                    onChange={(e) =>
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <label className="block text-[#212529] font-medium">
                    Location
                  </label>
                  <Select
                    isMulti
                    options={locationOptions}
                    value={locationOptions.filter((option) =>
                      filters.location.includes(option.value)
                    )}
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, "location")
                    }
                  />
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="block text-[#212529] font-medium">
                    Category
                  </label>
                  <Select
                    isMulti
                    options={categoryOptions}
                    value={categoryOptions.filter((option) =>
                      filters.category.includes(option.value)
                    )}
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, "category")
                    }
                  />
                </div>

                {/* Event Type Filter */}
                <div className="space-y-2">
                  <label className="block text-[#212529] font-medium">
                    Event Type
                  </label>
                  <Select
                    isMulti
                    options={eventTypeOptions}
                    value={eventTypeOptions.filter((option) =>
                      filters.type.includes(option.value)
                    )}
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, "type")
                    }
                  />
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="block text-[#212529] font-medium">
                    Price Range
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 p-2 border rounded-md focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none"
                      value={filters.price.min_price}
                      onChange={(e) =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          price: {
                            ...prevFilters.price,
                            min_price: e.target.value,
                          },
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 p-2 border rounded-md focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none"
                      value={filters.price.max_price}
                      onChange={(e) =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          price: {
                            ...prevFilters.price,
                            max_price: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="block text-[#212529] font-medium">
                    Date Range
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="date"
                      className="w-1/2 p-2 border rounded-md focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none"
                      value={filters.date.start_date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          date: {
                            ...prevFilters.date,
                            start_date: e.target.value,
                          },
                        }))
                      }
                    />
                    <input
                      type="date"
                      className="w-1/2 p-2 border rounded-md focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] outline-none"
                      value={filters.date.end_date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          date: {
                            ...prevFilters.date,
                            end_date: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="bg-gray-400 text-white px-6 py-2 rounded-md"
                  onClick={() => {
                    handleResetFilters();
                    setPage(1);
                  }}
                >
                  Reset Filters
                </button>
                <button
                  className="bg-[#007bff] text-white px-6 py-2 rounded-md"
                  onClick={() => {
                    setFilterApplied((prev) => !prev);
                    setPage(1);
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FilterEvents;
