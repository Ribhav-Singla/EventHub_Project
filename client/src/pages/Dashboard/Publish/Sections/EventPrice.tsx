import { useRecoilState } from "recoil";
import { EVENT_TYPE, eventState } from "../../../../recoil";
import { useEffect } from "react";

function EventPrice() {
  const [eventData, setEventData] = useRecoilState<EVENT_TYPE>(eventState);

  useEffect(() => {
    setEventData((prev) => ({
      ...prev,
      vip_ticket_price: prev.vip_ticket_price ?? null, // Ensure null for undefined or 0
      general_ticket_price: prev.general_ticket_price ?? null, // Ensure null for undefined or 0
    }));
  }, [setEventData]);

  const handleChange =
    (field: keyof EVENT_TYPE) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEventData((prev) => ({
        ...prev,
        [field]: value === "" ? null : Math.max(0, Number(value)), // Handle empty string and null
      }));
    };

  const handleUnlimitedChange = (field: keyof EVENT_TYPE) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setEventData((prev) => ({
      ...prev,
      [field]: isChecked ? -1 : 0, // -1 for unlimited tickets
    }));
  };

  return (
    <div className="space-y-6 bg-[#000a26] rounded-lg">
      <h2 className="text-lg font-medium text-gray-300">Pricing and Tickets</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* VIP Tickets */}
        <div className="p-4 border border-neutral-200/20 rounded-lg bg-[#000a26]">
          <label className="block text-sm font-medium text-gray-400">
            VIP Ticket Price
          </label>
          <input
            type="number"
            className="mt-2 block w-full px-3 py-2 border outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={eventData.vip_ticket_price ?? ""} // Convert null to empty string
            onChange={handleChange("vip_ticket_price")}
            required // Add required constraint
          />
          <label className="block text-sm font-medium text-gray-400 mt-4">
            VIP Tickets Count
          </label>
          <input
            type="number"
            className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={eventData.vip_tickets_count === -1 ? "" : eventData.vip_tickets_count ?? ""} // Handle unlimited count and null
            onChange={handleChange("vip_tickets_count")}
            disabled={eventData.vip_tickets_count === -1}
            required // Add required constraint
          />
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="unlimited_vip_tickets"
              checked={eventData.vip_tickets_count === -1}
              onChange={handleUnlimitedChange("vip_tickets_count")}
            />
            <label
              htmlFor="unlimited_vip_tickets"
              className="ml-2 text-sm text-gray-400"
            >
              Unlimited VIP Tickets
            </label>
          </div>
        </div>

        {/* General Tickets */}
        <div className="p-4 border border-neutral-200/20 rounded-lg bg-[#000a26]">
          <label className="block text-sm font-medium text-gray-400">
            General Ticket Price
          </label>
          <input
            type="number"
            className="mt-2 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={eventData.general_ticket_price ?? ""} // Convert null to empty string
            onChange={handleChange("general_ticket_price")}
            required // Add required constraint
          />
          <label className="block text-sm font-medium text-gray-400 mt-4">
            General Tickets Count
          </label>
          <input
            type="number"
            className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={eventData.general_tickets_count === -1 ? "" : eventData.general_tickets_count ?? ""} // Handle unlimited count and null
            onChange={handleChange("general_tickets_count")}
            disabled={eventData.general_tickets_count === -1}
            required // Add required constraint
          />
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="unlimited_general_tickets"
              checked={eventData.general_tickets_count === -1}
              onChange={handleUnlimitedChange("general_tickets_count")}
            />
            <label
              htmlFor="unlimited_general_tickets"
              className="ml-2 text-sm text-gray-400"
            >
              Unlimited General Tickets
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPrice;
