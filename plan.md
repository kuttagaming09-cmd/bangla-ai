# Bangla AI — পরিকল্পনা

## লক্ষ্য
একটি দ্রুত, ইনস্টলেশনবিহীন, বাংলা-কেন্দ্রিক ব্রাউজার সহকারী। এটি ছোট নিয়মভিত্তিক উত্তর ইঞ্জিনে সাধারণ প্রশ্ন, শুভেচ্ছা, তারিখ-সময়, নিরাপদ ছোট হিসাব এবং সীমিত প্রসঙ্গ পরিচালনা করবে। কোনো বাহ্যিক API, মডেল ডাউনলোড বা আলাদা সার্ভার নেই—তাই কম ক্ষমতার ডিভাইসেও দ্রুত লোড হবে এবং ব্যবহারকারীর কথা বাইরে যাবে না।

## অনুমোদিত পণ্য আচরণ
- সম্পূর্ণ বাংলা, মোবাইল ও ডেস্কটপে মানানসই চ্যাট ইন্টারফেস।
- সাধারণ প্রশ্নে ছোট, সহজ উত্তর; লাইভ খবর, জটিল গবেষণা ও উচ্চ-স্তরের কাজের সীমাবদ্ধতা স্পষ্টভাবে জানানো।
- সর্বশেষ ১২টি বার্তা `localStorage`-এ রেখে সীমিত কথোপকথন-প্রসঙ্গ বজায় রাখা।
- নতুন কথা/চ্যাট পরিষ্কারের নিয়ন্ত্রণ, লোডিং অবস্থা, ত্রুটি হলে আবার চেষ্টা।
- কম JavaScript, কোনো ফ্রেমওয়ার্ক বা ইমেজ অ্যাসেট নয়; GitHub Pages-এ সরাসরি প্রকাশযোগ্য স্ট্যাটিক ফাইল।

## নকশা
- **Design movement:** Quiet utility / warm editorial—প্রযুক্তিকে নরম, মানবিক ও কম ভীতিকর করা।
- **মূল নীতি:** দ্রুত, সংক্ষিপ্ত, ব্যক্তিগত, স্পর্শবান্ধব।
- **রং:** টিল সবুজ বিশ্বাস ও শান্তির জন্য, অফ-হোয়াইট দীর্ঘ পড়ার স্বস্তির জন্য, প্রবাল ছোট উষ্ণ accent হিসেবে।
- **Layout paradigm:** বাম পাশে ছোট editorial পরিচিতি, ডান পাশে একক focus chat card; মোবাইলে স্বাভাবিকভাবে এক কলামে নামে।
- **Signature elements:** বাঁকানো `বা` mark, ড্যাশড/গোলাকার ছোট pill, coral underline।
- **Interaction:** সরাসরি প্রশ্ন → দ্রুত typing state → ছোট উত্তর; shortcut chips কম চিন্তায় শুরু করায়।
- **Animation:** শুধু message rise, typing dots এবং subtle hover; motion কম ও অর্থপূর্ণ।
- **Typography:** সিস্টেম বাংলা sans-serif body; Georgia/Noto Serif Bengali editorial headline; স্তরভেদে 10–20px।
- **Brand essence:** কম শক্তির ডিভাইসে সাধারণ বাংলার দ্রুত সহকারী; personality — শান্ত, সরল, সহায়ক।
- **Brand voice:** “সহজ করে বলি।” / “জটিল হলে সীমাটা আগে জানাই।”
- **Wordmark:** `বা` অক্ষরসহ rounded speech-mark; default text logo নয়।
- **Signature brand color:** `#0f766e` টিল।

## প্রকল্প কাঠামো
- `index.html` — অ্যাপ shell, header, intro, chat interface এবং composer।
- `styles.css` — responsive visual system; কোনো external font বা asset dependency নেই।
- `app.js` — lightweight response rules, Bengali digit conversion, local memory, UI state।
- `manifest.json`, `favicon.svg` — install-free browser metadata এবং ছোট icon।
- `manus-routes.json` — একমাত্র `/` page route।
- `README.md` — GitHub Pages publish ও limitation নির্দেশনা।
- `TODO.md` — request-derived outcomes।
