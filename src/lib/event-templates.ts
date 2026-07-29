import { IntlMessageFormat } from "intl-messageformat";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";

/**
 * Event → notification template catalog (seed). EN is the source of truth;
 * BN/HI/NE flow through the certified-translator pipeline and fall back to EN
 * until translated (CLAUDE.md §7). Variables use ICU `{var}` / plural syntax.
 */
export const EVENT_TEMPLATES: Record<string, Partial<Record<Locale, string>>> = {
  "student.signed_up": { en: "{name} joined EduNomad." },
  "counsellor.assigned": {
    en: "Your counsellor {counsellor} has been assigned.",
    bn: "আপনার কাউন্সেলর {counsellor} নিযুক্ত হয়েছেন।",
  },
  "counsellor.message_sent": { en: "{counsellor}: {preview}" },
  "document.requested": { en: "Please upload your {document_type}." },
  "document.approved": { en: "Your {document_type} was approved." },
  "document.rework_requested": {
    en: "Your {document_type} needs a small fix: {reason}",
  },
  "shortlist.locked": {
    en: "Your shortlist of {count, plural, one {# programme} other {# programmes}} is locked.",
  },
  "application.submitted": { en: "Your application to {university} was submitted." },
  "application.info_requested": {
    en: "{university} requested more information for your application.",
  },
  "offer.received": { en: "Offer received from {university}!" },
  "payment.invoice": { en: "Invoice ready: {purpose} — {amount} {currency}, due {due_date}." },
  "payment.received": { en: "Payment of {amount} {currency} received." },
  "visa.appointment_booked": { en: "Your VFS appointment is booked at {location} on {datetime}." },
  "visa.submitted": { en: "Visa application submitted to {authority}." },
  "visa.approved": { en: "Your visa is approved! Pre-departure begins." },
  "service.requested": {
    en: "You asked us to arrange {service_type}. We'll confirm here.",
    bn: "আপনি {service_type} ব্যবস্থা করতে বলেছেন। আমরা এখানে নিশ্চিত করব।",
    hi: "आपने {service_type} की व्यवस्था करने को कहा है। हम यहीं पुष्टि करेंगे।",
    ne: "तपाईंले {service_type} मिलाउन भन्नुभयो। हामी यहीँ पुष्टि गर्नेछौं।",
  },
  "service.confirmed": {
    en: "Your {service_type} booking is confirmed.",
    bn: "আপনার {service_type} বুকিং নিশ্চিত হয়েছে।",
    hi: "आपकी {service_type} बुकिंग पुष्ट हो गई है।",
    ne: "तपाईंको {service_type} बुकिङ पुष्टि भयो।",
  },
  "housing.booked": {
    en: "Your accommodation is confirmed.",
    bn: "আপনার থাকার ব্যবস্থা নিশ্চিত হয়েছে।",
    hi: "आपका आवास पुष्ट हो गया है।",
    ne: "तपाईंको बसोबासको व्यवस्था पुष्टि भयो।",
  },
  "bank_account.opening_initiated": {
    en: "Your bank account opening has started.",
    bn: "আপনার ব্যাংক অ্যাকাউন্ট খোলার কাজ শুরু হয়েছে।",
    hi: "आपका बैंक खाता खोलने की प्रक्रिया शुरू हो गई है।",
    ne: "तपाईंको बैंक खाता खोल्ने काम सुरु भयो।",
  },
  "sim.ordered": {
    en: "Your SIM is ordered.",
    bn: "আপনার সিম অর্ডার করা হয়েছে।",
    hi: "आपका सिम ऑर्डर कर दिया गया है।",
    ne: "तपाईंको सिम अर्डर गरियो।",
  },
  "insurance.activated": {
    en: "Your health insurance is active.",
    bn: "আপনার স্বাস্থ্য বিমা সক্রিয় হয়েছে।",
    hi: "आपका स्वास्थ्य बीमा सक्रिय है।",
    ne: "तपाईंको स्वास्थ्य बिमा सक्रिय भयो।",
  },
  "airport_pickup.booked": {
    en: "Your airport pickup is booked.",
    bn: "আপনার বিমানবন্দর পিকআপ বুক করা হয়েছে।",
    hi: "आपका एयरपोर्ट पिकअप बुक हो गया है।",
    ne: "तपाईंको एयरपोर्ट पिकअप बुक भयो।",
  },
  "profile.completed": {
    en: "Your profile is complete.",
    bn: "আপনার প্রোফাইল সম্পূর্ণ হয়েছে।",
    hi: "आपका प्रोफ़ाइल पूरा हो गया है।",
    ne: "तपाईंको प्रोफाइल पूरा भयो।",
  },
  "eligibility.checked": {
    en: "We matched you to {total, plural, one {# programme} other {# programmes}}.",
    bn: "আমরা আপনাকে {total}টি প্রোগ্রামের সাথে মিলিয়েছি।",
    hi: "हमने आपको {total} प्रोग्राम से मिलाया।",
    ne: "हामीले तपाईंलाई {total} कार्यक्रमसँग मिलायौं।",
  },
  "call.booked": {
    en: "Your counsellor call is booked.",
    bn: "আপনার কাউন্সেলর কল বুক হয়েছে।",
    hi: "आपकी काउंसलर कॉल बुक हो गई है।",
    ne: "तपाईंको काउन्सेलर कल बुक भयो।",
  },
  "call.requested": {
    en: "Call requested — your counsellor will confirm a time.",
    bn: "কল অনুরোধ করা হয়েছে — আপনার কাউন্সেলর সময় নিশ্চিত করবেন।",
    hi: "कॉल का अनुरोध किया गया — आपका काउंसलर समय तय करेगा।",
    ne: "कल अनुरोध गरियो — तपाईंको काउन्सेलरले समय निश्चित गर्नुहुनेछ।",
  },
  "call.rescheduled": {
    en: "Your call has been rescheduled.",
    bn: "আপনার কল পুনঃনির্ধারিত হয়েছে।",
    hi: "आपकी कॉल का समय बदल दिया गया है।",
    ne: "तपाईंको कलको समय परिवर्तन गरियो।",
  },
  "counsellor.call_completed": {
    en: "Call completed with {counsellor}.",
    bn: "{counsellor}-এর সাথে কল সম্পন্ন হয়েছে।",
    hi: "{counsellor} के साथ कॉल पूरी हुई।",
    ne: "{counsellor} सँग कल सम्पन्न भयो।",
  },
  "counsellor.reassigned": {
    en: "Your counsellor has changed to {counsellor}.",
    bn: "আপনার কাউন্সেলর পরিবর্তিত হয়ে {counsellor} হয়েছেন।",
    hi: "आपका काउंसलर बदलकर {counsellor} हो गया है।",
    ne: "तपाईंको काउन्सेलर परिवर्तन भई {counsellor} हुनुभयो।",
  },
  "parent.invited": {
    en: "You invited a parent or sponsor to follow your journey.",
    bn: "আপনি একজন অভিভাবক বা স্পনসরকে আপনার যাত্রা অনুসরণ করতে আমন্ত্রণ জানিয়েছেন।",
    hi: "आपने एक अभिभावक या प्रायोजक को अपनी यात्रा देखने के लिए आमंत्रित किया।",
    ne: "तपाईंले अभिभावक वा प्रायोजकलाई आफ्नो यात्रा हेर्न निम्तो दिनुभयो।",
  },
  "parent.joined": {
    en: "Your parent or sponsor joined.",
    bn: "আপনার অভিভাবক বা স্পনসর যুক্ত হয়েছেন।",
    hi: "आपके अभिभावक या प्रायोजक शामिल हो गए।",
    ne: "तपाईंको अभिभावक वा प्रायोजक सामेल हुनुभयो।",
  },
  "shortlist.programme_added": {
    en: "{university} was added to your shortlist.",
    bn: "{university} আপনার শর্টলিস্টে যোগ হয়েছে।",
    hi: "{university} आपकी शॉर्टलिस्ट में जोड़ा गया।",
    ne: "{university} तपाईंको सर्टलिस्टमा थपियो।",
  },
  "shortlist.programme_removed": {
    en: "{university} was removed from your shortlist.",
    bn: "{university} আপনার শর্টলিস্ট থেকে সরানো হয়েছে।",
    hi: "{university} आपकी शॉर्टलिस्ट से हटाया गया।",
    ne: "{university} तपाईंको सर्टलिस्टबाट हटाइयो।",
  },
  "document.uploaded": {
    en: "You uploaded your {document_type}.",
    bn: "আপনি আপনার {document_type} আপলোড করেছেন।",
    hi: "आपने अपना {document_type} अपलोड किया।",
    ne: "तपाईंले आफ्नो {document_type} अपलोड गर्नुभयो।",
  },
  "document_checklist.generated": {
    en: "Your document checklist is ready.",
    bn: "আপনার নথির চেকলিস্ট প্রস্তুত।",
    hi: "आपकी दस्तावेज़ चेकलिस्ट तैयार है।",
    ne: "तपाईंको कागजात चेकलिस्ट तयार छ।",
  },
  "sop.locked": {
    en: "Your statement of purpose is locked and ready to submit.",
    bn: "আপনার স্টেটমেন্ট অব পারপাস লক হয়েছে এবং জমা দেওয়ার জন্য প্রস্তুত।",
    hi: "आपका स्टेटमेंट ऑफ़ पर्पस लॉक है और जमा करने के लिए तैयार है।",
    ne: "तपाईंको स्टेटमेन्ट अफ पर्पस लक भयो र पेस गर्न तयार छ।",
  },
  "application.approved": {
    en: "Your application to {university} passed our final check.",
    bn: "{university}-তে আপনার আবেদন আমাদের চূড়ান্ত যাচাই পাস করেছে।",
    hi: "{university} के लिए आपका आवेदन हमारी अंतिम जाँच में पास हुआ।",
    ne: "{university} का लागि तपाईंको आवेदन हाम्रो अन्तिम जाँच पास भयो।",
  },
  "visa.file_created": {
    en: "Your visa file has been opened.",
    bn: "আপনার ভিসা ফাইল খোলা হয়েছে।",
    hi: "आपकी वीज़ा फ़ाइल खोली गई है।",
    ne: "तपाईंको भिसा फाइल खोलियो।",
  },
  "visa.signed_off": {
    en: "Your visa file has been signed off by Compliance.",
    bn: "আপনার ভিসা ফাইল কমপ্লায়েন্স কর্তৃক অনুমোদিত হয়েছে।",
    hi: "आपकी वीज़ा फ़ाइल कंप्लायंस द्वारा साइन-ऑफ़ कर दी गई है।",
    ne: "तपाईंको भिसा फाइल कम्प्लायन्सले साइन-अफ गर्‍यो।",
  },
  "message.sent": {
    en: "New message from your counsellor.",
    bn: "আপনার কাউন্সেলরের কাছ থেকে নতুন বার্তা।",
    hi: "आपके काउंसलर से नया संदेश।",
    ne: "तपाईंको काउन्सेलरबाट नयाँ सन्देश।",
  },
  "visa.decision": { en: "A visa decision has been received. Your counsellor will call you." },
};

const cache = new Map<string, IntlMessageFormat>();

function humanize(type: string) {
  return type.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Render an event into a localized string. Falls back to the EN template when
 * the target locale's template is empty/missing, and to a humanized type when
 * no template exists.
 */
export function renderEventTemplate(
  event: { type: string; payload?: Record<string, unknown> | null },
  locale: Locale,
): string {
  const entry = EVENT_TEMPLATES[event.type];
  const raw = entry?.[locale] || entry?.[DEFAULT_LOCALE];
  if (!raw) return humanize(event.type);
  const vars = (event.payload ?? {}) as Record<string, unknown>;
  const cacheKey = `${locale} ${raw}`;
  try {
    let f = cache.get(cacheKey);
    if (!f) {
      f = new IntlMessageFormat(raw, locale);
      cache.set(cacheKey, f);
    }
    return String(f.format(vars));
  } catch {
    return raw.replace(/\{(\w+)\}/g, (_, k: string) =>
      k in vars ? String(vars[k]) : `{${k}}`,
    );
  }
}
