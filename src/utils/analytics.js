// Единый слой аналитики для рекламы: Google Analytics 4, Meta Pixel и Яндекс.Метрика.
// ID берутся из .env (см. .env.example). Если ID не задан — соответствующий
// скрипт не загружается, поэтому пустая конфигурация безопасна для продакшена.

export const ANALYTICS = {
  ga4: import.meta.env.VITE_GA4_ID || '',          // G-XXXXXXXXXX
  googleAds: import.meta.env.VITE_GOOGLE_ADS_ID || '', // AW-XXXXXXXXX
  metaPixel: import.meta.env.VITE_META_PIXEL_ID || '', // 1234567890
  yandex: import.meta.env.VITE_YANDEX_METRIKA_ID || '', // 99999999
};

// Сопоставление наших целей с метками конверсий Google Ads.
// Метку (label) выдают в Google Ads → Инструменты → Конверсии при создании
// действия-конверсии. Без метки конверсия в Google Ads не отправляется.
const GOOGLE_ADS_LABELS = {
  form_submit: import.meta.env.VITE_GADS_LABEL_LEAD || '',
  order_submit: import.meta.env.VITE_GADS_LABEL_LEAD || '',
  phone_click: import.meta.env.VITE_GADS_LABEL_CALL || '',
  whatsapp_click: import.meta.env.VITE_GADS_LABEL_WHATSAPP || '',
};

// GA4 с включённым Enhanced measurement сам собирает событие form_submit по любой
// отправке формы на странице. Наша цель называется так же, и в отчётах GA4 они бы
// слились в одно имя. Шлём её в GA4 под отдельным именем — на Google Ads, Meta и
// Яндекс это не влияет, там имена целей остаются прежними.
const GA4_EVENT_NAMES = {
  form_submit: 'lead_form_submit',
};

const isBrowser = typeof window !== 'undefined';

let initialized = false;

// Сопоставление наших целей со стандартными событиями Meta Pixel —
// Meta оптимизирует показы именно под стандартные события (Contact / Lead).
const META_STANDARD = {
  whatsapp_click: 'Contact',
  phone_click: 'Contact',
  email_click: 'Contact',
  form_submit: 'Lead',
  order_submit: 'Lead',
};

// GA4 и Google Ads используют один и тот же gtag.js — грузим скрипт один раз
// и конфигурируем оба идентификатора (config можно вызывать несколько раз).
function loadGtag(ga4Id, adsId) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // send_page_view:false — автоматический просмотр GA4 отключён намеренно.
  // Он бы ушёл до того, как страница выставит document.title, и заголовок в
  // отчётах был бы от предыдущей страницы. Просмотры шлёт usePageMeta, который
  // знает и путь, и заголовок. На Google Ads это не распространяется.
  if (ga4Id) window.gtag('config', ga4Id, { send_page_view: false });
  if (adsId) window.gtag('config', adsId);

  const srcId = ga4Id || adsId;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${srcId}`;
  document.head.appendChild(s);
}

function loadMetaPixel(id) {
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', id);
  window.fbq('track', 'PageView');
}

function loadYandexMetrika(id) {
  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    (k = e.createElement(t)),
      (a = e.getElementsByTagName(t)[0]),
      (k.async = 1),
      (k.src = r),
      a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
  window.ym(id, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

// Загружает счётчики один раз на стороне клиента.
export function initAnalytics() {
  if (!isBrowser || initialized) return;
  initialized = true;

  if (ANALYTICS.ga4 || ANALYTICS.googleAds) loadGtag(ANALYTICS.ga4, ANALYTICS.googleAds);
  if (ANALYTICS.metaPixel) loadMetaPixel(ANALYTICS.metaPixel);
  if (ANALYTICS.yandex) loadYandexMetrika(ANALYTICS.yandex);
}

// Универсальная отправка цели во все подключённые системы.
export function trackEvent(name, params = {}) {
  if (!isBrowser) return;

  if (window.gtag && ANALYTICS.ga4) {
    window.gtag('event', GA4_EVENT_NAMES[name] || name, params);
  }

  // Конверсия Google Ads: отправляем только для целей с заданной меткой.
  if (window.gtag && ANALYTICS.googleAds) {
    const label = GOOGLE_ADS_LABELS[name];
    if (label) {
      window.gtag('event', 'conversion', {
        send_to: `${ANALYTICS.googleAds}/${label}`,
        ...params,
      });
    }
  }

  if (window.fbq && ANALYTICS.metaPixel) {
    const standard = META_STANDARD[name];
    if (standard) {
      window.fbq('track', standard, params);
    } else {
      window.fbq('trackCustom', name, params);
    }
  }

  if (window.ym && ANALYTICS.yandex) {
    window.ym(ANALYTICS.yandex, 'reachGoal', name, params);
  }
}

let pageViewsSent = 0;

// Просмотр страницы. Вызывается из usePageMeta — он единственный знает и путь,
// и уже выставленный заголовок, поэтому только оттуда заголовок приходит верным.
export function trackPageView(path, title) {
  if (!isBrowser) return;

  pageViewsSent += 1;

  if (window.gtag && ANALYTICS.ga4) {
    // GA4 читает page_location/page_title, а не page_path — это параметр из
    // старой Universal Analytics, GA4 его игнорирует.
    window.gtag('event', 'page_view', {
      page_location: window.location.origin + path,
      page_title: title || document.title,
    });
  }

  // Meta и Яндекс шлют первый просмотр сами при инициализации, поэтому для них
  // (в отличие от GA4) первый вызов пропускаем, иначе он задвоится.
  if (pageViewsSent === 1) return;

  if (window.fbq && ANALYTICS.metaPixel) {
    window.fbq('track', 'PageView');
  }
  if (window.ym && ANALYTICS.yandex) {
    window.ym(ANALYTICS.yandex, 'hit', path);
  }
}
