import Testimonial from "@/components/testimonial";
import TestimonialImg01 from "@/public/images/christophel.png";
import TestimonialImg02 from "@/public/images/clementb.jpg";
import TestimonialImg03 from "@/public/images/emilie.jpeg";

export default function TestimonialsCarousel() {
  const testimonials = [
    {
      img: TestimonialImg01,
      name: "Christophe L",
      username: "@LassuytChristop",
      date: "May 19, 2025",
      content:
        "I wasn’t sure this would work for us, but the first leads I got were spot on. People we got were a perfect fit for our community of web3 finance leaders. I reached out, got a 21% reply rate, and scaled our community from 500 CFOs to 2,000+ finance leaders. Super impressed so far!",
      channel: "Twitter",
    },
    {
      img: TestimonialImg02,
      name: "Clement Bernard",
      username: "@Clement_brnrd",
      date: "Apr 12, 2025",
      content:
        "We tried Apollo, Clay, even hired a VA. Nothing gave us leads this relevant, this consistently. With Yuzuu, I just open my inbox every morning and know who I’m reaching out to. Yuzuu is the only lead gen tool I actually enjoy using.",
      channel: "Twitter",
    },
    {
      img: TestimonialImg03,
      name: "Emilie Flipot",
      username: "@emilieflipot",
      date: "Mar 04, 2025",
      content:
        "I used to spend hours trying to find good leads that weren’t total garbage. Yuzuu sends me the exact kind of prospects I want to talk to. It’s like having a mini growth team in my inbox.",
      channel: "Twitter",
    },
  ];

  return (
    <section id="testimonials" className="relative before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:h-[120%] before:bg-linear-to-b before:from-gray-100">
      <div className="pt-12 md:pt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
            Our customers have made thousands of dollars by sending the right emails to the right people
            </h2>
          </div>
        </div>
        <div className="relative mx-auto flex max-w-[94rem] justify-center">
          <div
            className="absolute bottom-20 -z-10 -translate-x-36"
            aria-hidden="true"
          >
            <div className="h-80 w-80 rounded-full bg-linear-to-tr from-blue-500 to-gray-900 opacity-30 blur-[160px] will-change-[filter]" />
          </div>
          <div className="absolute -bottom-10 -z-10" aria-hidden="true">
            <div className="h-80 w-80 rounded-full bg-blue-500 opacity-40 blur-[160px] will-change-[filter]" />
          </div>
          <div className="absolute bottom-0 -z-10" aria-hidden="true">
            <div className="h-56 w-56 rounded-full border-[20px] border-white blur-[20px] will-change-[filter]" />
          </div>
          {/* Row */}
          <div className="group inline-flex w-full flex-nowrap py-12 [mask-image:_linear-gradient(to_right,transparent_0,_black_10%,_black_90%,transparent_100%)] md:py-20">
            <div className="flex animate-[infinite-scroll_60s_linear_infinite] items-start justify-center group-hover:[animation-play-state:paused] md:justify-start *:mx-3">
              {/* Items */}
              {testimonials.map((testimonial, index) => (
                <Testimonial
                  key={index}
                  testimonial={testimonial}
                  className="w-[22rem] transition-transform duration-300 group-hover:rotate-0"
                >
                  {testimonial.content}
                </Testimonial>
              ))}
            </div>
            {/* Duplicated element for infinite scroll */}
            <div
              className="flex animate-[infinite-scroll_60s_linear_infinite] items-start justify-center group-hover:[animation-play-state:paused] md:justify-start *:mx-3"
              aria-hidden="true"
            >
              {/* Items */}
              {testimonials.map((testimonial, index) => (
                <Testimonial
                  key={index}
                  testimonial={testimonial}
                  cloned={true}
                  className="w-[22rem] transition-transform duration-300 group-hover:rotate-0"
                >
                  {testimonial.content}
                </Testimonial>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
