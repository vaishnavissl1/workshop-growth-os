import { WORKSHOP_CONFIG as cfg } from "@/config";

export type Lang = "en" | "te" | "kn" | "hi";
export const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "te", label: "తెలుగు" },
  { id: "kn", label: "ಕನ್ನಡ" },
  { id: "hi", label: "हिन्दी" },
];

export type Fill = { link: string; club?: string; name?: string };

export const MESSAGE_TITLES = ["Class group", "Club group", "Personal DM"] as const;

/** Message templates from SUBMISSION_CONTENT.md §C. {link} is replaced with the tracked link. */
const TEMPLATES: Record<Lang, string[]> = {
  en: [
    `Hey everyone 👋 Free 60-min live workshop for our batch: "${cfg.title}".\nYou leave with a deployed AI app link you can put on your resume before placement interviews. No AI experience needed.\nRegister (free, limited seats): {link}`,
    `{club} members, this one's worth an hour: hands-on GenAI workshop. Build an LLM app in Gradio, deploy it on Hugging Face, get certified.\nFinal-years especially: it's a solid resume project for placements.\n{link}`,
    `Hey {name}, you mentioned wanting an AI project for placements. There's a free 60-min workshop where you build and deploy one live. I've registered, join me?\n{link}`,
  ],
  // AI-drafted. Always shown with a "native-speaker review needed" label.
  hi: [
    `सभी को नमस्ते 👋 हमारे बैच के लिए एक फ्री 60 मिनट का लाइव वर्कशॉप: "${cfg.title}"।\nआप एक डिप्लॉय किया हुआ AI ऐप लिंक लेकर जाएंगे, जिसे प्लेसमेंट इंटरव्यू से पहले अपने रिज़्यूमे में लगा सकते हैं। AI का कोई अनुभव ज़रूरी नहीं।\nरजिस्टर करें (फ्री, सीमित सीटें): {link}`,
    `{club} के सदस्यों, यह एक घंटा सच में काम का है: हैंड्स-ऑन GenAI वर्कशॉप। Gradio में LLM ऐप बनाएं, Hugging Face पर डिप्लॉय करें और सर्टिफिकेट पाएं।\nख़ासकर फ़ाइनल-ईयर वालों के लिए: प्लेसमेंट के लिए एक अच्छा रिज़्यूमे प्रोजेक्ट।\n{link}`,
    `हाय {name}, तुमने बताया था कि प्लेसमेंट के लिए एक AI प्रोजेक्ट चाहिए। एक फ्री 60 मिनट का वर्कशॉप है जिसमें लाइव एक प्रोजेक्ट बनाकर डिप्लॉय करते हैं। मैंने रजिस्टर कर लिया है, तुम भी आओगे?\n{link}`,
  ],
  te: [
    `అందరికీ నమస్కారం 👋 మన బ్యాచ్ కోసం ఉచిత 60 నిమిషాల లైవ్ వర్క్‌షాప్: "${cfg.title}".\nప్లేస్‌మెంట్ ఇంటర్వ్యూలకు ముందు మీ రెజ్యూమేలో పెట్టుకోగలిగే డిప్లాయ్ చేసిన AI యాప్ లింక్‌తో మీరు బయటకు వస్తారు. AI అనుభవం అవసరం లేదు.\nరిజిస్టర్ అవ్వండి (ఉచితం, పరిమిత సీట్లు): {link}`,
    `{club} సభ్యులారా, ఈ ఒక్క గంట నిజంగా ఉపయోగపడుతుంది: హ్యాండ్స్-ఆన్ GenAI వర్క్‌షాప్. Gradioలో LLM యాప్ తయారు చేయండి, Hugging Faceలో డిప్లాయ్ చేయండి, సర్టిఫికేట్ పొందండి.\nముఖ్యంగా ఫైనల్ ఇయర్ వాళ్లకు: ప్లేస్‌మెంట్స్ కోసం మంచి రెజ్యూమే ప్రాజెక్ట్.\n{link}`,
    `హాయ్ {name}, ప్లేస్‌మెంట్స్ కోసం ఒక AI ప్రాజెక్ట్ కావాలని చెప్పావు కదా. లైవ్‌లో ఒక ప్రాజెక్ట్ తయారు చేసి డిప్లాయ్ చేసే ఉచిత 60 నిమిషాల వర్క్‌షాప్ ఉంది. నేను రిజిస్టర్ అయ్యాను, నువ్వు కూడా వస్తావా?\n{link}`,
  ],
  kn: [
    `ಎಲ್ಲರಿಗೂ ನಮಸ್ಕಾರ 👋 ನಮ್ಮ ಬ್ಯಾಚ್‌ಗಾಗಿ ಉಚಿತ 60 ನಿಮಿಷಗಳ ಲೈವ್ ವರ್ಕ್‌ಶಾಪ್: "${cfg.title}".\nಪ್ಲೇಸ್‌ಮೆಂಟ್ ಇಂಟರ್ವ್ಯೂಗಳ ಮೊದಲು ರೆಸ್ಯೂಮೆಯಲ್ಲಿ ಹಾಕಬಹುದಾದ ಡಿಪ್ಲಾಯ್ ಮಾಡಿದ AI ಆ್ಯಪ್ ಲಿಂಕ್ ನಿಮ್ಮ ಕೈಯಲ್ಲಿರುತ್ತದೆ. AI ಅನುಭವ ಬೇಕಿಲ್ಲ.\nನೋಂದಾಯಿಸಿ (ಉಚಿತ, ಸೀಮಿತ ಸೀಟುಗಳು): {link}`,
    `{club} ಸದಸ್ಯರೇ, ಈ ಒಂದು ಗಂಟೆ ನಿಜವಾಗಿಯೂ ಉಪಯುಕ್ತ: ಹ್ಯಾಂಡ್ಸ್-ಆನ್ GenAI ವರ್ಕ್‌ಶಾಪ್. Gradioನಲ್ಲಿ LLM ಆ್ಯಪ್ ಮಾಡಿ, Hugging Faceನಲ್ಲಿ ಡಿಪ್ಲಾಯ್ ಮಾಡಿ, ಸರ್ಟಿಫಿಕೇಟ್ ಪಡೆಯಿರಿ.\nವಿಶೇಷವಾಗಿ ಫೈನಲ್ ಇಯರ್ ಅವರಿಗೆ: ಪ್ಲೇಸ್‌ಮೆಂಟ್‌ಗೆ ಒಳ್ಳೆಯ ರೆಸ್ಯೂಮೆ ಪ್ರಾಜೆಕ್ಟ್.\n{link}`,
    `ಹಾಯ್ {name}, ಪ್ಲೇಸ್‌ಮೆಂಟ್‌ಗೆ ಒಂದು AI ಪ್ರಾಜೆಕ್ಟ್ ಬೇಕು ಅಂತ ಹೇಳಿದ್ದೆ ಅಲ್ವಾ. ಲೈವ್ ಆಗಿ ಒಂದು ಪ್ರಾಜೆಕ್ಟ್ ಮಾಡಿ ಡಿಪ್ಲಾಯ್ ಮಾಡುವ ಉಚಿತ 60 ನಿಮಿಷಗಳ ವರ್ಕ್‌ಶಾಪ್ ಇದೆ. ನಾನು ನೋಂದಾಯಿಸಿದ್ದೇನೆ, ನೀನೂ ಬರ್ತೀಯಾ?\n{link}`,
  ],
};

export function fillMessage(lang: Lang, index: number, f: Fill) {
  return TEMPLATES[lang][index]
    .replaceAll("{link}", f.link)
    .replaceAll("{club}", f.club?.trim() || "[Club name]")
    .replaceAll("{name}", f.name?.trim() || "[name]");
}

export function englishTemplate(index: number) {
  return TEMPLATES.en[index];
}

export function trackedLink(code: string) {
  return `${cfg.siteUrl}/?src=ambassador&amb=${encodeURIComponent(code)}`;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** TPO email from SUBMISSION_CONTENT.md §D. */
export function tpoEmail(college: string, tpoName: string, sender: string) {
  const c = college.trim() || "[College]";
  const when = new Date(cfg.sessionDate).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const link = `${cfg.siteUrl}/?src=tpo&college=${slug(c) || "your-college"}`;
  return {
    subject: `Free 60-min GenAI workshop for ${c}'s 2027 batch, ahead of placements`,
    body: `Dear ${tpoName.trim() || "[TPO name]"},

Placement interviews increasingly ask students about hands-on AI experience. We're running a free 60-minute live workshop, "${cfg.title}", where final-year students build and deploy a working AI application and leave with a public project link for their resume.

For ${c}, we can share:
• A ready-to-forward circular and WhatsApp message for your final-year groups
• A post-workshop report listing your students' deployed project links

Date: ${when} IST · Free · Any engineering branch
Registration link for ${c} students: ${link}

Would you be able to circulate this to the 2027 batch this week? Happy to share anything else you need.

Warm regards,
${sender}, Growth Team`,
  };
}
