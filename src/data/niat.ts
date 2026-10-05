/**
 * Facts about NIAT and NxtWave, copied from niatindia.com (checked 5 Oct 2026). They describe NIAT's upskilling
 * program and NxtWave's programs in general, not this one-hour workshop, and the page presents them that way.
 * Do not add, round up or invent entries. Where the site shows a company only as a logo, it is left out here
 * unless the name was readable.
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
  { name: "Dr. SS Mantha", role: "Former AICTE Chairman", line: "Architect of modern technical education" },
  { name: "Dr. Sandeep Sancheti", role: "Former Director, NITK Surathkal, NIT Delhi & NIT Goa", line: "A veteran of four decades in higher education" },
];

export const ADVISOR_QUOTE = {
  text: "NIAT is playing a crucial role in shaping industry-ready graduates through skill-based education. I’m proud to be associated with their journey.",
  by: "Dr. Sandeep Sancheti",
};

export const HIRING_COMPANIES = [
  "Infosys", "TCS", "Apple", "Cisco", "Dell Technologies", "HCLTech", "Ericsson", "Wells Fargo", "Shopify", "Optum",
  "Virtusa", "Fiserv", "Telstra", "Asian Paints", "HDFC Life", "Cyient", "Quest Global", "Tietoevry", "Technicolor", "ZF", "WNS",
];

export const PLACEMENTS = [
  { name: "Subhash", role: "SDE", lpa: 80 },
  { name: "D. Mohith Reddy", role: "SDE 1", lpa: 57 },
  { name: "Ritesh Baviskar", role: "AI Engineer", lpa: 35 },
  { name: "Naina", role: "Analyst Data Engineer AI Dev", lpa: 28 },
  { name: "Atul", role: "SWE", lpa: 25 },
  { name: "Sunil", role: "SDE", lpa: 18 },
  { name: "Sandeep Kumar", role: "Data Scientist", lpa: 12 },
];

export const MENTORS = [
  { name: "Rahul Attuluri", role: "Chief Executive Officer", company: "NxtWave" },
  { name: "Sravya Nimmagadda", role: "Senior Deep Learning Scientist", company: "NVIDIA" },
  { name: "Shiva Kumar", role: "Head of Engineering", company: "Fincent" },
  { name: "Sashank Gujjula", role: "Co-Founder", company: "NxtWave" },
  { name: "Giridhar Ganapavarapu", role: "Advisory Research Software Engineer" },
  { name: "Architha Nagelli", role: "Senior SDE" },
  { name: "Abhinav Reddy", role: "Software Development Engineer" },
  { name: "Shyama Dorbala", role: "Conv ML Team Lead" },
  { name: "Tushar Tayal", role: "Director of Engineering" },
  { name: "Siva Ghani Reddy", role: "Principal Product Manager" },
  { name: "Gowtham Reddy", role: "Principal Software Engineer" },
  { name: "Sanjay Sehgal", role: "Chairman & CEO" },
] as { name: string; role: string; company?: string }[];

export const STORIES = [
  { name: "Bharadwaj Reddy Poluri", role: "SDE, Amazon", quote: "The course is really well-structured. The way the problems for each topic have been segregated into assignments and tests was beneficial. It prepared me for interviews with FANG companies." },
  { name: "Vamsi", role: "SDE, D. E. Shaw & Co", quote: "One of the best programs I have seen so far. Everything is explained in a simple manner so that it's easy to understand. As the curriculum is designed by experts, you'll be ready for interviews with top companies." },
  { name: "Amit Rai", role: "Data Scientist", quote: "I wanted to get started with the field of Data Science. I built strong skills in Programming and Machine learning with NxtWave's program. The content is relevant to the current industry needs, and also it's easy to grasp." },
  { name: "Jayaditya Jakkam", role: "SDE", quote: "Every topic is taught efficiently in the least time possible. The structure and the quality of the content are of very high standards so that we'll able to crack the SDE roles." },
  { name: "V Sairam Reddy", role: "Engineer at EDG", quote: "The learning is very structured and the mentor tracking my progress is the best thing. Huge thanks to my mentor for guiding me in the right direction." },
];

export const COLLABORATIONS = ["NSDC Digital", "nasscom", "OpenAI Academy", "Base 44", "Tier IV", "Wix"];

export const RECOGNISED_BY = ["National Skill Development Corporation (NSDC)", "NASSCOM"];

export const SHARK_TANK = {
  quote: "No one has ever created a teaching methodology like NxtWave.",
  by: "Anupam Mittal",
  title: "Founder and CEO of People Group and Shaadi.com",
  where: "as mentioned on Shark Tank India",
};
