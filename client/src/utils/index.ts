import axios from "axios"
import { EVENT_TYPE, FILTER_STATE, TICKET, TIME_FRAME_TYPE } from "../recoil"
import moment from "moment-timezone"
import toast from "react-hot-toast"

export const uploadImages = async (images: File[] | string[]) => {
    const formData = new FormData()
    images.forEach((image, _) => {
        formData.append("files", image)
    })
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload_images`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log('error occured while uploading images');
        console.log(error);
        return []
    }
}

export const publishEvent = async (data: EVENT_TYPE) => {
    try {
        const trimmedTimeSlots = data.time_frame.map((slot) => ({
            ...slot,
            title: slot.title.trim(),
            description: slot.description.trim(),
        }));
        const images_url = await uploadImages(data.images)
        if(images_url.urls.length == 0){
            throw new Error ("Upload atleast 1 image.")
        }
        data = {
            ...data,
            images: images_url.urls,
            time_frame: trimmedTimeSlots
        }
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/event/publish`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log('error occured while publishing event');
        console.log(error);
        if ((error as any).response?.data?.message) {
            toast.error(`${(error as any).response.data.message}`);
        } else {
            toast.error("An unexpected error occurred");
        }
        throw new Error("Internal server error")
    }
}

export const updateEvent = async (data: EVENT_TYPE) => {
    try {
        const trimmedTimeSlots = data.time_frame.map((slot) => ({
            ...slot,
            title: slot.title.trim(),
            description: slot.description.trim(),
        }));
        let images_url = { urls: data.images };

        // Upload new images only if they exist and are not strings (i.e., not existing URLs)
        if (data.images && data.images.some((image) => typeof image !== "string")) {
            images_url = await uploadImages(data.images.filter((image) => typeof image !== "string"));
        }
        if(images_url.urls.length == 0){
            throw new Error ("Upload atleast 1 image.")
        }
        data = {
            ...data,
            title: data.title.trim(),
            description: data.description.trim(),
            images: images_url.urls,
            time_frame: trimmedTimeSlots
        }
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/${data.id}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log('error occured while updating event');
        console.log(error);
        if ((error as any).response?.data?.message) {
            toast.error(`${(error as any).response.data.message}`);
        } else {
            toast.error("An unexpected error occurred");
        }
        throw new Error("Internal server error")
    }
}

export const deleteEvent = async (eventId: string) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/${eventId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem('token')}`
            }
        })
        console.log(response.data);
    } catch (error) {
        console.log('error occured while deleting event');
        console.log(error);
        if ((error as any).response?.data?.message) {
            toast.error(`${(error as any).response.data.message}`);
        } else {
            toast.error("An unexpected error occurred");
        }
    }
}

export function formatDate(isoDateString: string): string {
    const date = new Date(isoDateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
}

export function extractTimeRange(timeFrames: TIME_FRAME_TYPE[]): string | null {
    if (timeFrames.length === 0) return null;

    const firstTime = timeFrames[0].time;
    const lastTime = timeFrames[timeFrames.length - 1].time;

    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const suffix = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${formattedHour}:${minutes} ${suffix}`;
    };

    const formattedFirstTime = formatTime(firstTime);
    const formattedLastTime = formatTime(lastTime);

    return `${formattedFirstTime} - ${formattedLastTime}`;
}

export const addToWishlist = async (eventId: string | undefined, heart: boolean) => {
    if (!eventId) return
    try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/wishlist/${eventId}`, { heart }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${localStorage.getItem('token')}`
            }
        })
    } catch (error) {
        console.log('error occured while adding to wishlist');
        console.log(error);
    }
}

export const formatFilterObj = (filterObj: FILTER_STATE) => {
    const flatFilters: Record<string, string | string[]> = {};

    // Flatten the filter object, including nested properties (price and date)
    const { price, date, ...restFilters } = filterObj;

    // Add simple key-value pairs for non-array properties
    for (const [key, value] of Object.entries(restFilters)) {
        if (Array.isArray(value)) {
            flatFilters[key] = value; // Keep array as it is (to be handled later in the query string)
        } else {
            flatFilters[key] = value;
        }
    }

    // Add price filters separately
    if (price) {
        if (price.min_price) flatFilters["min_price"] = price.min_price;
        if (price.max_price) flatFilters["max_price"] = price.max_price;
    }

    // Add date filters separately
    if (date) {
        if (date.start_date) flatFilters["start_date"] = date.start_date;
        if (date.end_date) flatFilters["end_date"] = date.end_date;
    }

    return flatFilters;
};

export const validateStatus = (date: string): boolean => {
    const currentDateTimeIST = moment.utc().add(5, 'hours').add(30, 'minutes');
    const givenDateTime = moment(date);
    return givenDateTime.isAfter(currentDateTimeIST);
};

export const handleTransaction = async (ticket: TICKET, eventId: string | undefined) => {
    if (!eventId) {
        return;
    }
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/ticket/transaction/${eventId}`, ticket, {
            headers: {
                "Authorization": `${localStorage.getItem('token')}`
            }
        })
        return response.data
    } catch (error) {
        console.log('error occured while transaction: ', error);
        throw new Error("Internal server error");
    }
}

export function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function stringAvatar(name: string) {
    const nameParts = name.replace(/[^a-zA-Z ]/g, "").split(" ").filter(Boolean);
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || "";
    const secondInitial = nameParts[1]?.[0]?.toUpperCase() || "";

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: firstInitial + (secondInitial || ""),
    };
}

export const Blogs = [
    {
        id: 0,
        title: "Proven Strategies to Boost Audience Engagement at Your Events",
        imageURL: "/image4.jpg",
        description: [
            {
                content:
                    "Engage your audience with hands-on workshops, breakout sessions, and live demonstrations that encourage participation and foster a dynamic event atmosphere.",
                imageURL: "/image11.jpeg",
            },
            {
                content:
                    "Utilize technology to run live polls, quizzes, and Q&A sessions, allowing attendees to voice their opinions and feel more connected to the event content. (Coming soon..)",
                imageURL: "/image4.jpg",
            },
            {
                content:
                    "Introduce elements like leaderboards, challenges, and rewards to make your event fun and competitive, driving higher levels of interaction. (Coming soon..)",
                imageURL: "/image4.jpg",
            },
            {
                content:
                    "Tailor sessions and activities to meet the interests of your audience, ensuring relevance and keeping them engaged throughout the event. (Coming soon..)",
            },
        ],
    },
    {
        id: 1,
        title: "Mastering Event Planning: From Vision to Execution",
        imageURL: "/image3.jpg",
        description: [
            {
                content:
                    "Start by clarifying the purpose and goals of your event, whether it’s networking, education, or entertainment, to guide every planning decision.",
                imageURL: "/image8.png",
            },
            {
                content:
                    "Efficiently allocate your budget, staff, and time, ensuring all logistics—from venue selection to vendor coordination—are handled smoothly.",
                imageURL: "/image9.png",
            },
            {
                content:
                    "Incorporate innovative themes, unique formats, and engaging content to bring your vision to life and create memorable experiences for attendees with the help of real time chat feature.",
                imageURL: "/image10.png",
            },
            {
                content:
                    "Gather feedback, analyze event data, and assess what worked and what didn’t, helping you refine future events for even greater success.",
            },
        ],
    },
    {
        id: 2,
        title: "The Power of Analytics: Using Data to Elevate Your Events",
        imageURL: "/image2.jpg",
        description: [
            {
                content:
                    "Track registration patterns, session attendance, and engagement metrics to gain insights into what your audience values most.",
                imageURL: "/image5.png",
            },
            {
                content:
                    "Use key performance indicators (KPIs) like attendee satisfaction scores, social media engagement, and ROI to evaluate event outcomes.",
                imageURL: "/image6.png",
            },
            {
                content:
                    "Leverage analytics to make informed decisions on everything from content curation to marketing strategies, ensuring continuous improvement.",
                imageURL: "/image7.png",
            },
            {
                content:
                    "Apply insights from past events to optimize future planning, tailoring experiences to meet evolving audience needs and preferences.",
            },
        ],
    },
];

export const users = [
    {
        name: "Jane Cooper",
        message: "Sure, let's meet at 2 PM",
        time: "10:42 AM",
        avatar: "/api/placeholder/40/40",
        status: "online",
        unreadCount: 3,
    },
    {
        name: "Wade Warren",
        message: "I'll check the documents",
        time: "Yesterday",
        avatar: "/api/placeholder/40/40",
        status: "offline",
    },
    {
        name: "Esther Howard",
        message: "Thanks for your help!",
        time: "Tuesday",
        avatar: "/api/placeholder/40/40",
        status: "online",
    },
    {
        name: "Cameron Williamson",
        message: "We need to discuss the project",
        time: "Monday",
        avatar: "/api/placeholder/40/40",
        status: "offline",
    },
    {
        name: "Brooklyn Simmons",
        message: "Did you get my email?",
        time: "Sunday",
        avatar: "/api/placeholder/40/40",
        status: "online",
        unreadCount: 1,
    },
];