
import { ORGANIZER_DETAILS_TYPE } from "../../../recoil";

function EventOrganizer({
  organizer_details,
}: {
  organizer_details: ORGANIZER_DETAILS_TYPE[];
}) {

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8 animate__fadeIn">
        <h3 className="text-xl font-bold text-neutral-800 mb-4">
          Need Help? Contact the Organizer
        </h3>
        <div className="space-y-2">
          {organizer_details.map((item, index) => {            
            return (
              <div key={index}>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">📧</span>
                  <span className="text-gray-600">{item.user.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-blue-600 font-semibold">📞</span>
                  <span className="text-gray-600">+{item.phone}</span>
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-semibold">💬</span>
            <span className="text-gray-600">
              Live chat available!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventOrganizer;
