export default function FloatingButtons() {
  const whatsappText = encodeURIComponent('Здравствуйте! Хочу узнать цену и наличие металлической сетки.');

  return (
    <div className="floatingButtons" aria-label="Быстрые контакты">
      <a className="floatingButton floatingButton--phone" href="tel:+7 701 587 7127" aria-label="Позвонить">
        ☎
      </a>
      <a
        className="floatingButton floatingButton--whatsapp"
        href={`https://wa.me/+7 701 587 7127?text=${whatsappText}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Написать в WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
