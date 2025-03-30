

interface TIME_FRAME {
  title : string
  description: string
  time: string
} 

function EventSchedule({time_frame}:{time_frame:TIME_FRAME[]}) {

  function convertTo12HourFormat(time:string) {
    const [hours, minutes] = time.split(":").map(Number); // Split hours and minutes
    const period = hours >= 12 ? "PM" : "AM"; // Determine AM/PM
    const hours12 = hours % 12 || 12; // Convert to 12-hour format (12 stays 12, 0 becomes 12)
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  return (
    <div>
        <div className="bg-white rounded-xl shadow-lg p-6 animate__fadeIn">
                <h2 className="text-2xl font-bold text-neutral-800 mb-4">
                  Event Schedule
                </h2>
                <div className="space-y-4">
                  {
                    time_frame.map((item,index)=>{
                      return (
                        <div className="flex gap-4 p-4 border-l-4 border-blue-600" key={index}>
                          <div className="w-32 font-semibold text-neutral-800">
                            {convertTo12HourFormat(item.time)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-800">
                              {item.title}
                            </h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
    </div>
  )
}

export default EventSchedule