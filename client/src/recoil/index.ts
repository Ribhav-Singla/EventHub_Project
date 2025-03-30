import { atom } from 'recoil';

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 7);
const formattedDate = futureDate.toISOString().split('T')[0]

export const authState = atom({
    key: 'authState',
    default: {
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        avatar: '',
        isAuthenticated: false
    }
});

export const eventState = atom<EVENT_TYPE>({
    key: 'eventState',
    default: {
        id: '',
        title: '',
        type: '',
        category: '',
        description: '',
        vip_ticket_price: 0,
        vip_tickets_count: 0,
        general_ticket_price: 0,
        general_tickets_count: 0,
        date: formattedDate,
        time_frame: [{
            title: 'Opening Activity Not Specified',
            description: 'Details for this time slot will be announced soon.',
            time: '09:00'
        }, {
            title: 'Closing Activity Not Specified',
            description: 'Details for this time slot will be announced soon.',
            time: '17:00'
        },],
        location: [{
            venue: '',
            city: '',
            country: ''
        }],
        images: [],
        organizer_details: [{
            phone: '',
            user: {
                email: ''
            }
        }]
    }
})

export const filterState = atom<FILTER_STATE>({
    key: 'filterState',
    default: {
        title: '',
        location: [],
        category: [],
        type: [],
        price: {
            max_price: '',
            min_price: '',
        },
        date: {
            start_date: '',
            end_date: '',
        }
    }
})

export const ticketState = atom<TICKET>({
    key: 'ticketState',
    default: {
        ticket_quantity: 1,
        ticket_category: 'General Admission',
        ticket_price: 0,
        ticket_amount: 0,
        vip_ticket_price: 0,
        vip_tickets_count: 0,
        vip_tickets_sold: 0,
        general_ticket_price: 0,
        general_tickets_count: 0,
        general_tickets_sold: 0,
        attendees: [],
        payment_type: '',
        transaction_id: '',
        event_title: '',
        event_category: '',
        event_date: '',
        event_venue: '',
        event_time: '',
    }
})

export const chatState = atom<{
    chatId: string
    messages: any[];
    users: any[];
    selectedUser: { id: string, firstname: string, lastname: string } | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    onlineUsers: any[]
}>({
    key: 'chatState',
    default: {
        chatId:'',
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
        onlineUsers: []
    }
})

export interface FILTER_STATE {
    title: string;
    location: string[];
    category: string[];
    type: string[];
    price: {
        max_price: string;
        min_price: string;
    };
    date: {
        start_date: string;
        end_date: string;
    };
}

export interface TICKET {
    ticket_quantity: number;
    ticket_category: string;
    attendees: ATTENDEE_DETAILS[];
    ticket_price: number;
    ticket_amount: number;
    vip_ticket_price: number;
    vip_tickets_count: number;
    vip_tickets_sold: number;
    general_tickets_count: number;
    general_tickets_sold: number;
    general_ticket_price: number;
    event_title: string;
    event_category: string;
    payment_type: string;
    transaction_id: string;
    event_date: string;
    event_venue: string;
    event_time: string;
};

export interface ATTENDEE_DETAILS {
    name: string;
    age: number | null;
    gender: string
}

export interface TIME_FRAME_TYPE {
    title: string;
    description: string;
    time: string;
}

export interface LOCATION_TYPE {
    venue: string;
    city: string;
    country: string;
}

export interface ORGANIZER_DETAILS_TYPE {
    phone: string;
    user: {
        email: string
    }
}

export interface EVENT_TYPE {
    id: string;
    title: string;
    type: string;
    category: string;
    description: string;
    vip_ticket_price: number;
    vip_tickets_count: number;
    general_ticket_price: number;
    general_tickets_count: number;
    date: string;
    time_frame: TIME_FRAME_TYPE[];
    location: LOCATION_TYPE[];
    images: File[] | string[];
    organizer_details: ORGANIZER_DETAILS_TYPE[];
}

export interface TOP_EVENT {
    title: string,
    revenue: number,
    ticketsSold: number,
    conversionRate: string,
    date: string,
    status: string
}

export interface UPCOMING_EVENT {
    title: string;
    date: string;
    location: string;
    time: TIME_FRAME_TYPE[];
    ticketsSold: number;
}

export interface RECENT_TRANSACTION {
    event: {
        title: string,
    },
    ticket_details: {
        ticket_quantity: number
    }[],
    created_at: string
}

export interface RECENT_EVENT {
    title: string,
    updated_at: string,
    created_at: string
}

export interface RECENT_ACTIVITY {
    events: RECENT_EVENT[],
    transactions: RECENT_TRANSACTION[]
}