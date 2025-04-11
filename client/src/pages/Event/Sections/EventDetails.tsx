import { LOCATION_TYPE, TIME_FRAME_TYPE } from "../../../recoil";
import { convertTo24Hour, extractTimeRange, formatDate } from "../../../utils";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import "add-to-calendar-button";

function EventDetails({
  title,
  description,
  date,
  time_frame,
  location,
}: {
  title: string;
  description: string;
  date: string;
  time_frame: TIME_FRAME_TYPE[];
  location: LOCATION_TYPE[];
}) {
  const shareUrl = window.location.href;
  const timeRange = extractTimeRange(time_frame);
  const [startFormatted, endFormatted] = timeRange
    ? timeRange.split(" - ")
    : ["", ""];
  const startTime24 = convertTo24Hour(startFormatted);
  const endTime24 = convertTo24Hour(endFormatted);

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6 animate__fadeIn">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">
          About the Event
        </h2>
        <p className="text-gray-600 leading-relaxed text-justify">
          {description}
        </p>
        <div className="space-y-4 mb-2 mt-5">
          <div className="flex items-center gap-3">
            <span className="text-[#212529]">🗓️</span>
            <span className="text-[#6c757d]">
              {formatDate(date)} | {extractTimeRange(time_frame)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#212529]">📍</span>
            <span className="text-[#6c757d]">
              {location[0].venue}, {location[0].city}, {location[0].country}
            </span>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col gap-4 justify-between items-center mt-5">
          <div>
            <add-to-calendar-button
              name={title}
              options="'Google'"
              location={`${location[0].venue}, ${location[0].city}, ${location[0].country}`}
              startDate={date}
              endDate={date}
              startTime={startTime24}
              endTime={endTime24}
              timeZone="Asia/Kolkata"
              buttonsList="true"
              buttonStyle="round"
              hideBranding="false"
              label="Add to Calendar"
            ></add-to-calendar-button>
          </div>
          <div className="flex gap-4">
            <FacebookShareButton url={shareUrl} title={title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
