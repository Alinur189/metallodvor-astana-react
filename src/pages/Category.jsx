import { Navigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import SidebarCatalog from '../components/SidebarCatalog.jsx';
import { getCategoryBySlug } from '../data/categories.js';
import { getProductsByCategory, products } from '../data/products.js';
import { getCategoryContent } from '../data/categoryContent.js';
import { usePageMeta } from '../utils/usePageMeta.js';
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '../utils/jsonLd.js';

export default function Category({ onOrder }) {
  const { category: categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return <Navigate to="/catalog" replace />;
  }

  return <CategoryView category={category} onOrder={onOrder} />;
}

function CategoryView({ category, onOrder }) {
  const categoryProducts = getProductsByCategory(category.slug);

  // Контентные блоки под рекламный трафик (LPE): заголовки со словами
  // запроса, цены, FAQ. Есть не у всех категорий — см. categoryContent.js.
  const content = getCategoryContent(category.slug);
  const extraProducts = (content?.extraProductIds ?? [])
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: category.title, path: `/catalog/${category.slug}` },
  ]);

  usePageMeta(
    content?.meta?.title ?? `${category.title} — купить в Астане | МеталлоДвор`,
    content?.meta?.description ?? `${category.description} Цены и наличие в МеталлоДвор Астана.`,
    undefined,
    `/catalog/${category.slug}`,
    // JSON-LD допускает массив блоков в одном скрипте.
    content?.faq ? [breadcrumbJsonLd, buildFaqJsonLd(content.faq)] : breadcrumbJsonLd,
  );

  return (
    <section className="container pageLayout">
      <SidebarCatalog />

      <div className="pageContent">
        <div className="pageHero pageHero--compact">
          <span className="eyebrow">Категория</span>
          <h1>{content?.h1 ?? category.title}</h1>
          <p>{content?.intro ?? category.description}</p>
        </div>

        <div className="sectionHead sectionHead--tight">
          <div>
            <h2>Товары в категории</h2>
            <p>{categoryProducts.length} позиций в каталоге</p>
          </div>
          <Link className="textLink" to="/catalog">Все категории →</Link>
        </div>

        <div className="productGrid">
          {categoryProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrder={onOrder}
              priority={index === 0}
            />
          ))}
        </div>

        {extraProducts.length > 0 && (
          <>
            <div className="sectionHead sectionHead--tight">
              <div>
                <h2>{content.extraProductsHeading}</h2>
              </div>
            </div>
            <div className="productGrid">
              {extraProducts.map((product) => (
                <ProductCard key={product.id} product={product} onOrder={onOrder} />
              ))}
            </div>
          </>
        )}

        {content?.sections && (
          <div className="articleContent">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                {section.list && (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {/* Цены не дублируются в данных контента — список собирается
                    из products.js по ID, поэтому не может разойтись с каталогом. */}
                {section.priceProductIds && (
                  <>
                    <ul>
                      {section.priceProductIds
                        .map((id) => products.find((product) => product.id === id))
                        .filter(Boolean)
                        .map((product) => (
                          <li key={product.id}>
                            <Link to={`/product/${product.id}`}>{product.title}</Link>,{' '}
                            {product.size} — {product.price}
                          </li>
                        ))}
                    </ul>
                    <p className="priceNote">
                      Цены ориентировочные и могут меняться.{' '}
                      <a
                        href={`https://wa.me/77015877127?text=${encodeURIComponent(
                          content.priceNoteMessage ?? 'Здравствуйте! Хочу уточнить актуальность цен.',
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Уточните актуальность цен в WhatsApp
                      </a>
                      .
                    </p>
                  </>
                )}
              </section>
            ))}

            {content.faq && (
              <>
                <h2>Частые вопросы</h2>
                <div className="faqList">
                  {content.faq.map((item) => (
                    <details key={item.question} className="faqItem">
                      <summary>{item.question}</summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </>
            )}

            {content.guide && (
              <p>
                <Link className="textLink" to={content.guide.path}>
                  {content.guide.label} →
                </Link>
              </p>
            )}
          </div>
        )}

        {/* Контактный блок. Почти все заявки приходят кликом по tel: / wa.me,
            а не через форму, поэтому на странице, куда ведёт реклама, эти две
            ссылки должны быть прямо под товарами. */}
        <div className="ctaBanner ctaBanner--light">
          <div>
            <span className="eyebrow">Расчет за 5 минут</span>
            <h2>Уточнить цену: {category.title}</h2>
            <p>
              Назовите размер и объем — посчитаем стоимость с доставкой по Астане и скажем,
              что есть на складе сейчас.
            </p>
          </div>
          <div className="ctaBanner__actions">
            <a
              className="btn btn--whatsapp"
              href={`https://wa.me/77015877127?text=${encodeURIComponent(
                `Здравствуйте! Интересует ${category.title}. Подскажите цену и наличие.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Узнать цену в WhatsApp
            </a>
            <a className="btn btn--primary" href="tel:+77015877127">Позвонить</a>
          </div>
        </div>
      </div>
    </section>
  );
}
