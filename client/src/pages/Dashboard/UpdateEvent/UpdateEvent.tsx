import { useEffect, useState } from "react";
import Publish from "../Publish/Publish";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../../components/Spinner/Spinner";
import { useSetRecoilState } from "recoil";
import { EVENT_TYPE, eventState } from "../../../recoil";

function UpdateEvent() {
  const eventId = useParams().eventId;
  const setEventData = useSetRecoilState(eventState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${eventId}`
        );
        setEventData((prev: EVENT_TYPE) => {
          return {
            ...prev,
            id: response.data.id,
            title: response.data.title,
            type: response.data.type,
            category: response.data.category,
            description: response.data.description,
            vip_ticket_price: response.data.vip_ticket_price,
            vip_tickets_sold: response.data.vip_tickets_sold,
            vip_tickets_count: response.data.vip_tickets_count,
            general_ticket_price: response.data.general_ticket_price,
            general_tickets_sold: response.data.general_tickets_sold,
            general_tickets_count: response.data.general_tickets_count,
            date: response.data.date,
            time_frame: response.data.time_frame,
            location: response.data.location,
            organizer_details: response.data.organizer_details,
            images: response.data.images,
          };
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000a26]">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Publish />
    </div>
  );
}

export default UpdateEvent;
