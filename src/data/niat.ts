/**
 * Facts about NIAT and NxtWave, copied from niatindia.com (checked 5 Oct 2026). They describe NIAT's upskilling
 * program and NxtWave's programs in general, not this one-hour workshop, and the page presents them that way.
 * Do not add, round up or invent entries. Photos and logos in public/niat are NIAT's own, downloaded from that page.
 */

export const OUTCOMES = [
  ["1200+", "AI-powered projects built"],
  ["100+", "startups launched"],
  ["200+", "NIATians secured internships with stipends"],
  ["2500+", "companies hired from us"],
];

export const MICRO_SPECIALISATIONS = ["Foundations of Generative AI", "Generative and Agentic AI"];

export const MICRO_EARN = [
  "IIT Kharagpur OCN Micro-Specialisation Certificate on successful completion",
  "IIT Kharagpur OCN student identity card and email ID for the programme duration",
  "IIT Kharagpur OCN alumni status on successful completion",
];

export const STATES = [
  "Telangana", "Andhra Pradesh", "Haryana", "Maharashtra", "Rajasthan", "Karnataka",
  "Tamil Nadu", "Delhi NCR", "Madhya Pradesh", "Uttar Pradesh", "Odisha",
];

export const ADVISORS = [
  { slug: "ss-mantha", name: "Dr. SS Mantha", role: "Former AICTE Chairman", line: "Architect of modern technical education" },
  { slug: "sandeep-sancheti", name: "Dr. Sandeep Sancheti", role: "Former Director, NITK Surathkal, NIT Delhi & NIT Goa", line: "A veteran of four decades in higher education" },
];

export const ADVISOR_QUOTE = {
  text: "NIAT is playing a crucial role in shaping industry-ready graduates through skill-based education. I’m proud to be associated with their journey.",
  by: "Dr. Sandeep Sancheti",
};

/** Logos shown in NIAT's "2500+ companies" wall, in the same order. Files: public/niat/hire-NN.png */
export const HIRING_COMPANIES = [
  "Quest Global", "Cyient", "Infosys", "Tietoevry", "Technicolor", "Ares", "Google", "Majorel", "Deloitte", "Netflix",
  "CDW", "Broadridge", "Amdocs", "Swiggy", "Wipro", "Amazon", "HDFC Life", "Asian Paints", "TCS", "ZF",
  "Telstra", "Ericsson", "Company", "Tata Elxsi", "BigBasket", "S&P Global", "Salesforce", "Align", "Huawei", "NTT Data",
  "Fiserv", "Apple", "Dell Technologies", "Optum", "Virtusa", "Computacenter", "CGI", "Jio", "Capgemini", "Cognizant",
  "PwC", "Artifint", "HSBC", "Teleperformance", "Omega Healthcare", "IIFL Finance", "Cisco", "Wells Fargo", "Armstrong", "Shopify",
  "HCLTech", "WNS", "Siemens", "Archents", "Synopsys", "Walmart", "Oracle", "EY", "IQVIA", "ITC Infotech",
];

/** slug = file name in public/niat (placed-<slug>.png photo, logo-p-<slug>.png company logo) */
export const PLACEMENTS = [
  { slug: "subhash", name: "Subhash", role: "SDE", lpa: 80, company: "Apple" },
  { slug: "d-mohith-reddy", name: "D. Mohith Reddy", role: "SDE 1", lpa: 57, company: "Meesho" },
  { slug: "ritesh-baviskar", name: "Ritesh Baviskar", role: "AI Engineer", lpa: 35, company: "Fractal" },
  { slug: "naina", name: "Naina", role: "Analyst Data Engineer AI Dev", lpa: 28, company: "BlackRock" },
  { slug: "atul", name: "Atul", role: "SWE", lpa: 25, company: "Paytm" },
  { slug: "sunil", name: "Sunil", role: "SDE", lpa: 18, company: "ICICI Bank" },
  { slug: "sandeep-kumar", name: "Sandeep Kumar", role: "Data Scientist", lpa: 12, company: "Virtusa" },
];

/** mentor-<slug>.png photo, logo-m-<slug>.png company logo */
export const MENTORS = [
  { slug: "rahul-attuluri", name: "Rahul Attuluri", role: "Chief Executive Officer", company: "NxtWave" },
  { slug: "sravya-nimmagadda", name: "Sravya Nimmagadda", role: "Senior Deep Learning Scientist", company: "NVIDIA" },
  { slug: "shiva-kumar", name: "Shiva Kumar", role: "Head of Engineering", company: "Fincent" },
  { slug: "sashank-gujjula", name: "Sashank Gujjula", role: "Co-Founder", company: "NxtWave" },
  { slug: "giridhar-ganapavarapu", name: "Giridhar Ganapavarapu", role: "Advisory Research Software Engineer", company: "IBM" },
  { slug: "architha-nagelli", name: "Architha Nagelli", role: "Senior SDE", company: "Kotak Mahindra Bank" },
  { slug: "abhinav-reddy", name: "Abhinav Reddy", role: "Software Development Engineer", company: "X" },
  { slug: "shyama-dorbala", name: "Shyama Dorbala", role: "Conv ML Team Lead", company: "Liftoff" },
  { slug: "tushar-tayal", name: "Tushar Tayal", role: "Director of Engineering", company: "Swiggy" },
  { slug: "siva-ghani-reddy", name: "Siva Ghani Reddy", role: "Principal Product Manager", company: "Microsoft" },
  { slug: "gowtham-reddy", name: "Gowtham Reddy", role: "Principal Software Engineer", company: "Microsoft" },
  { slug: "sanjay-sehgal", name: "Sanjay Sehgal", role: "Chairman & CEO", company: "MSys Technologies" },
];

/** story-<slug>.png photo (none for V Sairam Reddy: the site's is too small), logo-s-<slug> company logo */
export const STORIES = [
  { slug: "bharadwaj-reddy-poluri", name: "Bharadwaj Reddy Poluri", role: "SDE", company: "Amazon", logoExt: "png", photo: true, quote: "The course is really well-structured. The way the problems for each topic have been segregated into assignments and tests was beneficial. It prepared me for interviews with FANG companies." },
  { slug: "vamsi", name: "Vamsi", role: "SDE", company: "D. E. Shaw & Co", logoExt: "jpg", photo: true, quote: "One of the best programs I have seen so far. Everything is explained in a simple manner so that it's easy to understand. As the curriculum is designed by experts, you'll be ready for interviews with top companies." },
  { slug: "amit-rai", name: "Amit Rai", role: "Data Scientist", company: "Walmart", logoExt: "png", photo: true, quote: "I wanted to get started with the field of Data Science. I built strong skills in Programming and Machine learning with NxtWave's program. The content is relevant to the current industry needs, and also it's easy to grasp." },
  { slug: "jayaditya-jakkam", name: "Jayaditya Jakkam", role: "SDE", company: "Flipkart", logoExt: "png", photo: true, quote: "Every topic is taught efficiently in the least time possible. The structure and the quality of the content are of very high standards so that we'll able to crack the SDE roles." },
  { slug: "v-sairam-reddy", name: "V Sairam Reddy", role: "Engineer at EDG", company: "MathWorks", logoExt: "png", photo: false, quote: "The learning is very structured and the mentor tracking my progress is the best thing. Huge thanks to my mentor for guiding me in the right direction." },
];

/** Tiles in the same order and colours as NIAT's own. logo = file in public/niat; label is shown beside or instead of it. */
export const COLLABORATIONS = [
  { name: "NSDC Digital", logo: "collab-1.png", tile: "bg-[#FFDADA]" },
  { name: "nasscom", logo: "collab-3.png", tile: "bg-[#A8000F]" },
  { name: "Base 44", logo: "collab-4.png", label: "BASE 44", tile: "bg-[#E06A00] text-white" },
  { name: "Tier IV", logo: "collab-5.png", tile: "bg-[#0F2F3A]" },
  { name: "OpenAI Academy", logo: "collab-6.png", label: "OpenAI Academy", tile: "bg-[#12151F] text-white" },
  { name: "Wix", logo: "collab-7.png", tile: "bg-slate-200" },
];

export const RECOGNISED_BY = [
  { name: "National Skill Development Corporation (NSDC)", logo: "recog-1.webp" },
  { name: "NASSCOM", logo: "recog-2.webp" },
];

export const SHARK_TANK = {
  quote: "No one has ever created a teaching methodology like NxtWave.",
  by: "Anupam Mittal",
  title: "Founder and CEO of People Group and Shaadi.com",
  where: "as mentioned on Shark Tank India",
};
