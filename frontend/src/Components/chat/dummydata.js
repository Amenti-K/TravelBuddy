export const dummyChatRooms = [
  {
    _id: "chat1",
    name: "Trip to Paris",
    lastMessage: {
      text: "Can't wait to see the Eiffel Tower!",
      timestamp: new Date("2025-04-28T14:23:00Z"),
      sender: {
        senderId: "user1",
        fullName: "Alice Johnson",
      },
    },
    unseenCount: 3,
  },
  {
    _id: "chat2",
    name: "Project Meeting",
    lastMessage: {
      text: "Deadline is extended by a week.",
      timestamp: new Date("2025-04-27T16:45:00Z"),
      sender: {
        senderId: "user2",
        fullName: "Mark Wilson",
      },
    },
    unseenCount: 2,
  },
  {
    _id: "chat3",
    name: "Family Group",
    lastMessage: {
      text: "Don't forget grandma's birthday!",
      timestamp: new Date("2025-04-29T10:00:00Z"),
      sender: {
        senderId: "user3",
        fullName: "Emily Smith",
      },
    },
    unseenCount: 5,
  },
  {
    _id: "chat4",
    name: "Weekend Hike",
    lastMessage: {
      text: "Let's meet at 7 AM sharp!",
      timestamp: new Date("2025-04-28T07:30:00Z"),
      sender: {
        senderId: "user4",
        fullName: "Jake Lee",
      },
    },
    unseenCount: 1,
  },
  {
    _id: "chat5",
    name: "Startup Crew",
    lastMessage: {
      text: "MVP is live 🚀",
      timestamp: new Date("2025-04-26T19:50:00Z"),
      sender: {
        senderId: "user5",
        fullName: "Nina Patel",
      },
    },
    unseenCount: 4,
  },
  {
    _id: "chat5",
    name: "Trip to Paris",
    lastMessage: {
      text: "Can't wait to see the Eiffel Tower!",
      timestamp: new Date("2025-04-28T14:23:00Z"),
      sender: {
        senderId: "user1",
        fullName: "Alice Johnson",
      },
    },
    unseenCount: 3,
  },
  {
    _id: "chat6",
    name: "Project Meeting",
    lastMessage: {
      text: "Deadline is extended by a week.",
      timestamp: new Date("2025-04-27T16:45:00Z"),
      sender: {
        senderId: "user2",
        fullName: "Mark Wilson",
      },
    },
    unseenCount: 2,
  },
  {
    _id: "chat7",
    name: "Family Group",
    lastMessage: {
      text: "Don't forget grandma's birthday!",
      timestamp: new Date("2025-04-29T10:00:00Z"),
      sender: {
        senderId: "user3",
        fullName: "Emily Smith",
      },
    },
    unseenCount: 5,
  },
  {
    _id: "chat8",
    name: "Weekend Hike",
    lastMessage: {
      text: "Let's meet at 7 AM sharp!",
      timestamp: new Date("2025-04-28T07:30:00Z"),
      sender: {
        senderId: "user4",
        fullName: "Jake Lee",
      },
    },
    unseenCount: 1,
  },
  {
    _id: "chat9",
    name: "Startup Crew",
    lastMessage: {
      text: "MVP is live 🚀",
      timestamp: new Date("2025-04-26T19:50:00Z"),
      sender: {
        senderId: "user5",
        fullName: "Nina Patel",
      },
    },
    unseenCount: 14,
  },
];

export const dummyMessages = [
  {
    _id: "msg1",
    sender: {
      senderId: "user1",
      fullName: "Alice Johnson",
    },
    text: "Hey everyone, are we ready for the trip?",
    timestamp: new Date("2025-04-28T08:30:00Z"),
    seenBy: ["user2", "user3"],
  },
  {
    _id: "msg2",
    sender: {
      senderId: "user2",
      fullName: "Mark Wilson",
    },
    text: "Almost! Just packing up the essentials.",
    timestamp: new Date("2025-04-28T08:45:00Z"),
    seenBy: ["user1", "user3"],
  },
  {
    _id: "msg3",
    sender: {
      senderId: "user3",
      fullName: "Emily Smith",
    },
    text: "I’m bringing snacks 🥪",
    timestamp: new Date("2025-04-28T09:00:00Z"),
    seenBy: ["user1", "user2"],
  },
  {
    _id: "msg4",
    sender: {
      senderId: "user4",
      fullName: "Jake Lee",
    },
    text: "Has anyone booked the hotel yet?",
    timestamp: new Date("2025-04-28T09:15:00Z"),
    seenBy: ["user1"],
  },
  {
    _id: "msg5",
    sender: {
      senderId: "user5",
      fullName: "Nina Patel",
    },
    text: "Yup, it’s all done!",
    timestamp: new Date("2025-04-28T09:20:00Z"),
    seenBy: [],
  },
  {
    _id: "msg6",
    sender: {
      senderId: "user1",
      fullName: "Alice Johnson",
    },
    text: "Awesome! Can’t wait 🔥 Mostly sunny 🌞 what’s the weather like in Paris this week?",
    timestamp: new Date("2025-04-28T09:30:00Z"),
    seenBy: ["user2", "user3", "user4"],
  },
  {
    _id: "msg7",
    sender: {
      senderId: "user3",
      fullName: "Emily Smith",
    },
    text: "What’s the weather like in Paris this week?What’s the weather like in Paris this week?What’s the weather like in Paris this week?What’s the weather like in Paris this week?What’s the weather like in Paris this week?What’s the weather like in Paris this week?",
    timestamp: new Date("2025-04-28T09:45:00Z"),
    seenBy: ["user1", "user2"],
  },
  {
    _id: "msg8",
    sender: {
      senderId: "user2",
      fullName: "Mark Wilson",
    },
    text: "Mostly sunny 🌞 What’s the weather like in Paris this week?Mostly sunny 🌞 What’s the weather like in Paris this week?Mostly sunny 🌞 What’s the weather like in Paris this week?Mostly sunny 🌞 What’s the weather like in Paris this week?Mostly sunny 🌞 What’s the weather like in Paris this week?Mostly sunny 🌞 What’s the weather like in Paris this week?Mostly sunny 🌞 What’s the weather like in Paris this week?",
    timestamp: new Date("2025-04-28T10:00:00Z"),
    seenBy: ["user1"],
  },
  {
    _id: "msg9",
    sender: {
      senderId: "user5",
      fullName: "Nina Patel",
    },
    text: "Let’s share the itinerary here",
    timestamp: new Date("2025-04-28T10:15:00Z"),
    seenBy: [],
  },
  {
    _id: "msg10",
    sender: {
      senderId: "user4",
      fullName: "Jake Lee",
    },
    text: "Uploading it now 📁",
    timestamp: new Date("2025-04-28T10:20:00Z"),
    seenBy: ["user1", "user5"],
  },
];
