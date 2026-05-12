export const categories = [
  {
    slug: 'setka-svarnaya',
    title: 'Сетка сварная',
    description: 'Рулонная и картовая сварная сетка для строительства, ограждений и армирования.',
  },
  {
    slug: 'setka-kladochnaya',
    title: 'Сетка кладочная',
    description: 'Кладочная сетка для кирпичной кладки, блоков и усиления стен.',
  },
  {
    slug: 'setka-rabitsa',
    title: 'Сетка рабица',
    description: 'Оцинкованная и черная рабица для заборов, складов и участков.',
  },
  {
    slug: 'setka-armaturnaya',
    title: 'Сетка арматурная',
    description: 'Арматурные карты для стяжки, фундамента, плит и монолитных работ.',
  },
  {
    slug: 'setka-pvl',
    title: 'Сетка просечно-вытяжная',
    description: 'ПВЛ-сетка для настилов, ступеней, вентиляции и защитных конструкций.',
  },
  {
    slug: 'provoloka-vyazalnaya',
    title: 'Проволока вязальная',
    description: 'Проволока для вязки арматуры, строительных и монтажных работ.',
  },
  {
    slug: 'armatura',
    title: 'Арматура',
    description: 'Арматура А500С разных диаметров для монолитного строительства.',
  },
  {
    slug: 'profilnaya-truba',
    title: 'Профильная труба',
    description: 'Профильная труба для каркасов, навесов, ворот и металлоконструкций.',
  },
];

export const getCategoryBySlug = (slug) => categories.find((category) => category.slug === slug);

export const getCategoryTitle = (slug) =>
  categories.find((category) => category.slug === slug)?.title || 'Категория';
