import Accordion from "@/components/accordion";

export default function Faqs() {
  const faqs = [
    {
      question: "Will the leads really be relevant to me?",
      answer:
        "If it’s not relevant, it’s worthless. And we know that. We analyze your site and match leads based on your actual product and ideal customer. No generic scraping here. It's fully tailored to your offer.",
    },
    {
      question: "How do I know these aren’t just scraped, recycled contacts?",
      answer:
        "We don’t dump CSVs on your lap. Each lead is fresh, verified, and chosen for you. They are not pulled from some dusty database from 2021.",
      active: true,
    },
    {
      question: "Why only 3 leads per day?",
      answer:
        "3 leads/day is the free plan, enough to test the waters. Need more? Upgrade anytime and get up to 30 fresh, qualified leads every morning. Start small, scale when you're ready.",
    },
    {
      question: "Why pay for this when I can do it myself with LinkedIn or Apollo?",
      answer:
        "Sure, if you want to spend 3 hours/day prospecting. We save you time and deliver better-fit leads. It’s like having an SDR, minus the $5k/month.",
    },
    {
      question: "Will I get their contact info? Can I actually reach them?",
      answer:
        "Every lead comes with verified email, LinkedIn, and why they’re a good fit. You get real contacts, not just company logos.",
    },
    {
      question: "What if the leads don’t convert?",
      answer:
        "We get you in front of the right people. What you say to them is up to you, but we’ll even give you cold email templates to help.",
    },
    {
      question: "How do you even know who my ideal customers are?",
      answer:
        "Your website tells us everything: what you sell, who it’s for, the tools you use. We build your ICP from that. Don’t like a lead? Tell us, and the system gets smarter.",
    },
  ];

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <h2 className="text-3xl font-bold md:text-4xl">
              Questions we often get
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  title={faq.question}
                  id={`faqs-${index}`}
                  active={faq.active}
                >
                  {faq.answer}
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
