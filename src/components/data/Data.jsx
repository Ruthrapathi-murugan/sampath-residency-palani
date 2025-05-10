export const navList = [
  {
    id: 1,
    path: "/",
    text: "Home",
  },
  {
    id: 2,
    path: "/about",
    text: "About",
  },
  {
    id: 3,
    path: "/services",
    text: "Services",
  },
  {
    id: 4,
    path: "/rooms",
    text: "Rooms",
  },
  {
    id: 5,
    path: "/page",
    text: "Page",
    subItems: [
      {
        id: 51,
        path: "/booking",
        text: "Booking",
      },
      {
        id: 52,
        path: "/team",
        text: "Our Team",
      },
      {
        id: 53,
        path: "/testimonial",
        text: "Testimonial",
      },
      {
        id:54,
        path: "/googlereviews",
        text:"Google Reviews"

      },
    ],
  },
  {
    id:6,
    path:"/photos",
    text:"photos"


  },
  {
    id: 7,
    path: "/contact",
    text: "Contact",
  },
];
export const socialIcons = [
  {
    icon: <i className="fab fa-facebook-f"></i>,
  },
  
  {
    icon: <i className="fab fa-instagram"></i>,
  },
  {
    icon: <i className="fab fa-linkedin-in"></i>,
  },
  {
    icon: <i className="fab fa-youtube"></i>,
  },
];

export const carouselData = [
  {
    img: "../assets/img/Outdoor1.jpg",
    title: "Discover A Brand Luxurious & Budget Hotel in Palani",
    subtitle: "luxury living",
    btn1: "Our Room",
    btn2: "Book Room",
  },
  {
    img: "../assets/img/carousel-2.jpg",
    title: "Discover A Brand Luxurious & Budget Hotel in palani",
    subtitle: "luxury living",
    btn1: "Our Room",
    btn2: "Book Room",
  }, 

];
export const about = [
  {
    icon: <i class="fa fa-hotel fa-2x text-primary mb-2"></i>,
    text: "Rooms",
    count: "28",
  },
  {
    icon: <i class="fa fa-users fa-2x text-primary mb-2"></i>,
    text: "Staffs",
    count: "10",
  },
  {
    icon: <i class="fa fa-users-cog fa-2x text-primary mb-2"></i>,
    text: "Customers",
    count: "2000+",
  },
];



export const services = [
  {
    icon: <i class="fa fa-hotel fa-2x text-primary"></i>,
    name: "Rooms",
    discription: "We Have Multiple Choice of Rooms and Different Category",
    path: "/rooms", // Route for Rooms page

    
  },
  {
    icon: <i class="fa fa-utensils fa-2x text-primary"></i>,
    name: "Room services",
    discription: "We Provides 24*7 Rooms services",
    path: "/roomservice", 
  },
];

// photos upload for rooms 
export const photos = [
  {
    image: "../assets/img/outdoor.jpg",
   
  },

  {
    image: "../assets/img/outdoor3.jpeg",
   
  },
  {
    image: "../assets/img/coridor1.jpeg",
   
  },
  {
    image: "../assets/img/coridor2.jpeg",
   
  },
  {
    image: "../assets/img/coridor3.jpeg",
   
  },
  {
    image: "../assets/img/Room1.jpeg",
   
  },
  {
    image: "../assets/img/Room2.jpeg",
   
  },
  {
    image: "../assets/img/Room3.jpeg",
   
  },
  
  
  {
    image: "../assets/img/Room4.jpeg",
   
  },
  {
    image: "../assets/img/carousel-1.jpg",
   
  },
  {
    image: "../assets/img/room-1.jpg",

  },
  {
    image: "../assets/img/room-3.jpg",
 
  },
  {
    image: "../assets/img/room-3.jpg",
 
  },
  {
    image: "../assets/img/room-3.jpg",
 
  },
  {
    image: "../assets/img/5be.jpg",
 
  },
  {
    image: "../assets/img/3.jpg",
 
  },
];

export const team = [
  {
    image: "../assets/img/team-1.jpg",
    name: "Full Name",
    designation: "Designation",
  },
  {
    image: "../assets/img/team-2.jpg",
    name: "Full Name",
    designation: "Designation",
  },
  {
    image: "../assets/img/team-3.jpg",
    name: "Full Name",
    designation: "Designation",
  },
  {
    image: "../assets/img/team-3.jpg",
    name: "Full Name",
    designation: "Designation",
  },
];

export const footerItem = [
  {
    id: 1,
    header: "Company",
    UnitItem: [
      {
        name: "About Us",
        to: "/about",  // Explicit path for this item
      },
      {
        name: "Contact Us",
        to: "/contact",
      },
      {
        name: "Privacy Policy",
        to: "/privacy-policy",
      },
      {
        name: "Terms & Condition",
        to: "/terms-condition",
      },
      {
        name: "Support",
        to: "/support",
      },
    ],
  },
  {
    id: 2,
    header: "Services",
    UnitItem: [
      {
        name: "Food & Restaurant",
        to: "/food-restaurant",
      },
      {
        name: "Spa & Fitness",
        to: "/spa-fitness",
      },
    ],
  },
];


export const footerContact = [
  {
    icon: <i className="fa fa-map-marker-alt me-3"></i>,
    name: "201 Pattali Street, Idumban Kovil Itteri Rd, opp. Eswarapatta Kovil, South Anna Nagar, Palani, Tamil Nadu 624601",
  },
  {
    icon: <i className="fa fa-phone-alt me-3"></i>,
    name: "+91 98945-74934",
  },
  {
    icon: <i className="fa fa-envelope me-3"></i>,
    name: "selvamstores24@gmail.com",
  },
];

export const contact = [
  {
    icon: <i class="fa fa-envelope-open text-primary me-2"></i>,
    title: "Booking",
    email: "selvamstores24@gmail.com",
  },
  {
    icon: <i className="fas fa-phone-alt text-primary me-2"></i>,
    title: "Contact Numbers",
    contacts: [  // Changed to array for multiple numbers
      "+91 98945-74934",
      "+91 96263-80310" // Add your second number here
    ]
  },
  {
    icon: <i class="fa fa-envelope-open text-primary me-2"></i>,
    title: "General",
    email: "sampathresidencyatpalani@gmail.com",
  },
];
export const testimonial = [
  {
    description:
      "sampath residency is a good hotel to stay and its budget hotel and friendly staff to guide",
    name: "nair",
    profession: "Professional",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: "../assets/img/testimonial-1.jpg",
  },
  {
    description:
      "sampath residency is a good hotel to stay and its budget hotel and friendly staff to guide",
    name: "Client Name",
    profession: "Profession",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: "../assets/img/testimonial-2.jpg",
  },
  {
    description:
      "sampath residency is a good hotel to stay and its budget hotel and friendly staff to guide",
    name: "Client Name",
    profession: "Profession",
    icon: (
      <i class="fa fa-quote-right fa-3x text-primary position-absolute end-0 bottom-0 me-4 mb-n1"></i>
    ),
    img: "../assets/img/testimonial-3.jpg",
  },
];

export const roomItems = [
  {
    id: 1,
    img: "../assets/img/room-1.jpg",
    price: "Rs.1800/night",
    name: "Double bed A/C",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    amenities: ["Air Conditioning",  "Free Wi-Fi",  "TV",  "Private Bathroom"],
    additionalImages: [
      "../assets/img/room-1.jpg",
      "../assets/img/room-2.jpg",],
      additionalVideos: [
        "../assets/img/video.mp4",
        "../assets/img/video.mp4",
      ],
    
    description:
      "Ideal for small families or couples, these rooms provide a cozy and peaceful space to relax after a day of darshan at the renowned Palani Murugan Temple..",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },

  {
    id: 2,
    img: "../assets/img/room-2.jpg",
    price: "Rs.2000//night",
    name: "Triple Bed A/C",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    amenities: ["Air Conditioning",  "Free Wi-Fi",  "TV",  "Private Bathroom"],
    additionalImages: [
      "../assets/img/room-1.jpg",
      "../assets/img/room-2.jpg",],
      additionalVideos: [
        "../assets/img/video.mp4",
        "../assets/img/video.mp4",
      ],
    description:
      " Perfect for medium-sized families or groups, these spacious rooms ensure a comfortable stay with essential amenities to make your pilgrimage memorable.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
  {
    id: 3,
    img: "../assets/img/room-3.jpg",
    price: "Rs.2200//night",
    name: "Four Bed A/C",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ], amenities: ["Air Conditioning",  "Free Wi-Fi",  "TV",  "Private Bathroom"],
    additionalImages: [
      "../assets/img/room-1.jpg",
      "../assets/img/room-2.jpg",],
      additionalVideos: [
        "../assets/img/video.mp4",
        "../assets/img/video.mp4",
      ],
    description:
      "Designed for larger families or small pilgrim groups, these rooms offer ample space and a serene environment to rest and rejuvenate.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
  {
    id: 4,
    img: "../assets/img/room-3.jpg",
    price: "Rs.2400//night",
    name: "Five Bed A/C",
    star: [
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
      <small class="fa fa-star text-primary"></small>,
    ],
    amenities: ["Air Conditioning",  "Free Wi-Fi",  "TV",  "Private Bathroom"],
    additionalImages: [
      "../assets/img/room-1.jpg",
      "../assets/img/room-2.jpg",],
      additionalVideos: [
        "../assets/img/video.mp4",
        "../assets/img/video.mp4"
      ],
    description:
      "Tailored for big families or devotional groups, these rooms combine space, comfort, and convenience, ensuring everyone enjoys a harmonious and pleasant stay.",
    yellowbtn: "View Detail",
    darkbtn: "book now",
  },
];

export const facility = [
  {
    icon: <i class="fa fa-bed text-primary me-2"></i>,
    quantity: 1,
    facility: "bed",
  },
  {
    icon: <i class="fa fa-bath text-primary me-2"></i>,
    quantity: 1,
    facility: "bath",
  },
  {
    icon: <i class="fa fa-wifi text-primary me-2"></i>,
    facility: "Wifi",
  },
];
