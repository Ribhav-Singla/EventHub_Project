
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Music Festival Attendee",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    text: "The organization was flawless! From ticket booking to the actual event experience, everything was perfect. Will definitely attend more events!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Tech Conference Delegate",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    text: "The networking opportunities were incredible. Met some amazing people and learned so much. The venue and arrangements were top-notch.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Art Exhibition Visitor",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
    text: "A beautifully curated experience! The attention to detail and the quality of exhibitions were outstanding. Can't wait for the next one!",
    rating: 5,
  }
];

function Testimonials() {
  return (
    <div>
      <section id="Testimonials" className="pt-5 pb-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14 relative">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeIn">
            What Our Attendees Say
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto relative overflow-hidden">
              <div className="absolute h-full w-full bg-blue-400 animate-slide"></div>
            </div>
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`bg-neutral-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300 animate__animated animate__fadeInUp animate__delay-${index}s`}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${testimonial.imageUrl})` }}></div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-neutral-900">{testimonial.name}</h3>
                    <p className="text-neutral-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-700 mb-6">{testimonial.text}</p>
                <div className="flex text-yellow-400">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <svg key={idx} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Testimonials;
