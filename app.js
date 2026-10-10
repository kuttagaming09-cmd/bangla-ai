(() => {
  'use strict';
  const STORAGE_KEY = 'bangla-ai-chat-v1';
  const MAX_MESSAGES = 12;
  const bnDigits = '০১২৩৪৫৬৭৮৯';
  const enDigits = '0123456789';
  const $ = (selector) => document.querySelector(selector);
  const messagesEl = $('#messages');
  const form = $('#chatForm');
  const input = $('#messageInput');
  const sendButton = $('#sendButton');
  const charCount = $('#charCount');
  const memoryLabel = $('#memoryLabel');
  let history = [];
  let lastQuestion = '';

  const toBanglaDigits = (value) => String(value).replace(/[0-9]/g, (d) => bnDigits[d]);
  const toEnglishDigits = (value) => String(value).replace(/[০-৯]/g, (d) => enDigits[bnDigits.indexOf(d)]);
  const nowLabel = () => new Intl.DateTimeFormat('bn-BD', { hour: 'numeric', minute: '2-digit' }).format(new Date());
  const clean = (text) => text.trim().replace(/\s+/g, ' ');
  const includesAny = (text, words) => words.some((word) => text.includes(word));

  function loadHistory() {
    try { history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { history = []; }
    if (!Array.isArray(history)) history = [];
    history.slice(-MAX_MESSAGES).forEach((item) => renderMessage(item.role, item.text, item.time, false));
    memoryLabel.textContent = history.length ? `সাম্প্রতিক ${toBanglaDigits(Math.ceil(history.length / 2))}টি বার্তা মনে রাখা হচ্ছে` : 'সাম্প্রতিক কথাগুলো মনে রাখা হচ্ছে';
  }

  function saveHistory() { localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_MESSAGES))); }

  function renderMessage(role, text, time = nowLabel(), animate = true) {
    const article = document.createElement('article');
    article.className = `message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
    if (!animate) article.style.animation = 'none';
    const avatar = document.createElement('div');
    avatar.className = 'avatar'; avatar.setAttribute('aria-hidden', 'true'); avatar.textContent = role === 'user' ? 'আপনি' : 'বা';
    const wrap = document.createElement('div'); wrap.className = 'bubble-wrap';
    const label = document.createElement('span'); label.className = 'message-label'; label.textContent = `${role === 'user' ? 'আপনি' : 'Bangla AI'} · ${time}`;
    const bubble = document.createElement('div'); bubble.className = 'bubble';
    const paragraph = document.createElement('p'); paragraph.textContent = text;
    bubble.appendChild(paragraph); wrap.append(label, bubble); article.append(avatar, wrap); messagesEl.appendChild(article);
    if (animate) messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' }); else messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(role, text) {
    const item = { role, text, time: nowLabel() };
    history.push(item); history = history.slice(-MAX_MESSAGES); saveHistory(); renderMessage(role, text, item.time);
    memoryLabel.textContent = `সাম্প্রতিক ${toBanglaDigits(Math.ceil(history.length / 2))}টি বার্তা মনে রাখা হচ্ছে`;
  }

  function showTyping() {
    const article = document.createElement('article'); article.className = 'message assistant-message'; article.id = 'typingMessage';
    article.innerHTML = '<div class="avatar" aria-hidden="true">বা</div><div class="bubble-wrap"><span class="message-label">Bangla AI · লিখছে</span><div class="bubble typing-bubble"><i></i><i></i><i></i></div></div>';
    messagesEl.appendChild(article); messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  }
  function hideTyping() { $('#typingMessage')?.remove(); }

  function findName(text) {
    const match = text.match(/(?:আমার নাম|আমাকে)\s*([\u0980-\u09FF\s]{2,24})/i);
    return match ? match[1].replace(/[।,.!?]+$/, '').trim() : '';
  }

  function calculate(text) {
    const raw = toEnglishDigits(text).replace(/×/g, '*').replace(/÷/g, '/').replace(/[^0-9+*/().%\-\s]/g, '');
    if (!/[+*/%\-]/.test(raw) || !/\d/.test(raw)) return null;
    if (/[a-z]/i.test(raw)) return null;
    try {
      const value = Function(`"use strict"; return (${raw})`)();
      if (!Number.isFinite(value) || Math.abs(value) > 1e12) return null;
      return value;
    } catch { return null; }
  }

  function answer(question) {
    const text = clean(question).toLowerCase();
    const storedName = localStorage.getItem('bangla-ai-name') || '';
    const newName = findName(question);
    if (newName) { localStorage.setItem('bangla-ai-name', newName); return `ভালো লাগল, ${newName}! মনে রাখলাম। আর কী নিয়ে সাহায্য করব?`; }
    const math = calculate(question);
    if (math !== null && (/[+*/%\-]/.test(toEnglishDigits(question)) || text.includes('কত'))) return `হিসাবের উত্তর: ${toBanglaDigits(Number.isInteger(math) ? math : math.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''))}`;
    if (includesAny(text, ['হ্যালো', 'হাই', 'আসসালামু', 'সালাম', 'hello', 'hi'])) return storedName ? `হ্যালো ${storedName}! কেমন আছেন?` : 'হ্যালো! কেমন আছেন? সাধারণ কোনো প্রশ্ন করুন, আমি পাশে আছি।';
    if (includesAny(text, ['তুমি কী করতে পারো', 'কি করতে পারো', 'কী পারো', 'সাহায্য'])) return 'আমি সাধারণ প্রশ্নের সংক্ষিপ্ত উত্তর, ছোট হিসাব, তারিখ-সময় এবং দৈনন্দিন তথ্য নিয়ে সাহায্য করতে পারি। জটিল বা লাইভ তথ্যের জন্য আমি উপযুক্ত নই।';
    if (includesAny(text, ['তোমার নাম', 'তুমি কে'])) return 'আমার নাম Bangla AI। আমি ব্রাউজারে চলা ছোট বাংলা সহকারী—সহজ কাজেই আমার সবচেয়ে ভালো ব্যবহার।';
    if (includesAny(text, ['আজকের তারিখ', 'আজ কত তারিখ', 'তারিখ কত'])) return `আজ ${new Intl.DateTimeFormat('bn-BD', { dateStyle: 'full' }).format(new Date())}।`;
    if (includesAny(text, ['কয়টা বাজে', 'কটা বাজে', 'সময় কত', 'সময় কত', 'এখন কয়টা'])) return `এখন সময় ${new Intl.DateTimeFormat('bn-BD', { hour: 'numeric', minute: '2-digit' }).format(new Date())}।`;
    if (includesAny(text, ['আবহাওয়া', 'আবহাওয়া', 'বৃষ্টি হবে', 'weather', 'খবর'])) return 'আমি লাইভ আবহাওয়া বা খবর দেখতে পারি না। আপনার এলাকার আবহাওয়ার জন্য বিশ্বস্ত আবহাওয়া অ্যাপ দেখুন।';
    if (includesAny(text, ['ধন্যবাদ', 'থ্যাংকস', 'thanks'])) return 'স্বাগতম! দরকার হলে আবার জিজ্ঞেস করুন।';
    if (includesAny(text, ['ভালো আছ', 'কেমন আছ', 'কেমন আছেন'])) return 'আমি ভালো আছি—আপনার প্রশ্নের অপেক্ষায় আছি।';
    if (includesAny(text, ['কোড লিখ', 'অ্যাপ বানাও', 'ওয়েবসাইট বানাও', 'প্রোগ্রাম'])) return 'আমি ছোট উদাহরণ বা ধারণা বুঝিয়ে দিতে পারি, তবে বড় সফটওয়্যার বানানো আমার কাজ নয়। প্রশ্নটি একটু ছোট করে লিখুন।';
    if (includesAny(text, ['গবেষণা', 'প্রমাণ কর', 'বিশ্লেষণ', 'বিস্তারিত'])) return 'এটি আমার ছোট ক্ষমতার বাইরে হতে পারে। বিষয়টি এক লাইনে সহজ করে লিখলে আমি সাধারণ ধারণা দেওয়ার চেষ্টা করব।';
    if (text.length < 3) return 'একটু বিস্তারিত করে লিখবেন? তাহলে সহজভাবে উত্তর দিতে পারব।';
    if (lastQuestion && (text.includes('আরও') || text.includes('বিস্তারিত'))) return `আগের কথাটি ছিল “${lastQuestion.slice(0, 46)}${lastQuestion.length > 46 ? '…' : ''}”। আপনি কোন অংশটি আরও জানতে চান?`;
    return 'বুঝেছি। এটি নিয়ে আমার সাধারণ ধারণা হলো—সহজভাবে ধাপে ধাপে করলে কাজটি করা যায়। আপনি চাইলে প্রশ্নটি আরও নির্দিষ্ট করে লিখুন, আমি ছোট করে উত্তর দেব।';
  }

  async function send(text) {
    const question = clean(text); if (!question || sendButton.disabled) return;
    lastQuestion = question; addMessage('user', question); input.value = ''; updateCount(); sendButton.disabled = true; showTyping();
    await new Promise((resolve) => setTimeout(resolve, 280));
    try { hideTyping(); addMessage('assistant', answer(question)); } catch { hideTyping(); addError(); }
    sendButton.disabled = false; input.focus();
  }

  function addError() {
    const article = document.createElement('article'); article.className = 'message assistant-message';
    article.innerHTML = '<div class="avatar" aria-hidden="true">বা</div><div class="bubble-wrap"><span class="message-label">Bangla AI</span><div class="bubble error-bubble"><p>উত্তর তৈরি করতে একটু সমস্যা হয়েছে।</p><button class="retry-button" type="button">আবার চেষ্টা করুন</button></div></div>';
    messagesEl.appendChild(article); article.querySelector('button').addEventListener('click', () => { article.remove(); send(lastQuestion); });
  }

  function updateCount() { charCount.textContent = `${toBanglaDigits(input.value.length)} / ৫০০`; input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 130)}px`; }
  function resetChat() {
    history = []; lastQuestion = ''; localStorage.removeItem(STORAGE_KEY); messagesEl.innerHTML = ''; renderMessage('assistant', 'নতুন কথা শুরু হলো। কী জানতে চান?', nowLabel()); memoryLabel.textContent = 'সাম্প্রতিক কথাগুলো মনে রাখা হচ্ছে'; input.focus();
  }
  input.addEventListener('input', updateCount);
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); } });
  form.addEventListener('submit', (event) => { event.preventDefault(); send(input.value); });
  $('#clearButton').addEventListener('click', resetChat); $('#newChatButton').addEventListener('click', resetChat);
  document.querySelectorAll('[data-prompt]').forEach((button) => button.addEventListener('click', () => send(button.dataset.prompt)));
  loadHistory(); updateCount();
})();
