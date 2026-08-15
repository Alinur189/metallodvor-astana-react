import { useEffect } from 'react';
import { initAnalytics, trackEvent } from '../utils/analytics.js';

// Определяет тип контакта по ссылке для делегированного клика.
function resolveLinkGoal(href) {
  if (!href) return null;
  if (href.startsWith('tel:')) return 'phone_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (href.includes('wa.me') || href.includes('api.whatsapp.com')) return 'whatsapp_click';
  return null;
}

// Подключает счётчики, ловит клики по всем контактным ссылкам сайта
// (tel / WhatsApp / mailto) и отправляет просмотры при SPA-переходах.
export default function Analytics() {
  useEffect(() => {
    initAnalytics();

    const onClick = (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;

      const goal = resolveLinkGoal(link.getAttribute('href'));
      if (!goal) return;

      trackEvent(goal, {
        link_url: link.href,
        link_text: (link.textContent || '').trim().slice(0, 80),
      });
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  // Просмотры страниц шлёт usePageMeta — он вызывается на каждой из страниц и
  // делает это после того, как выставит document.title.
  return null;
}
