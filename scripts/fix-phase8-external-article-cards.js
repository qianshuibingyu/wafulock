const fs = require('fs');
const path = require('path');

const articles = {
  assessment: 'wf-026-redundant-hidden-lock-project-assessment',
  rfq: 'invisible-smart-lock-rfq-preparation',
  firstOrder: 'invisible-smart-lock-distributor-first-order'
};

const sites = [
  {
    root: 'D:\\WebSite\\Enwafu',
    cards: [
      ['assessment', 'Which Projects Suit the WF-026 Redundant Invisible Smart Lock?', 'September 5, 2026', 'For <strong>project procurement and operations teams</strong>: evaluate <strong>WF-026 dual-system, dual-motor architecture</strong> against door conditions, sample validation, power planning, maintenance readiness and total cost of ownership.'],
      ['rfq', 'What to Prepare Before Requesting a Quote for Invisible Smart Locks', 'September 2, 2026', 'For <strong>procurement teams, distributors and brands</strong>: prepare <strong>door data, quantities, access methods and target-market requirements</strong> so suppliers can quote the right configuration, samples, packaging and support scope.'],
      ['firstOrder', 'First Invisible Smart-Lock Order: SKU, Samples, Packaging and After-Sales Checklist', 'August 29, 2026', 'For <strong>distributors and brand owners</strong>: turn <strong>SKU selection, sample validation, packaging, installation support and after-sales planning</strong> into one first-order delivery checklist before quantities are fixed.']
    ]
  },
  {
    root: 'D:\\WebSite\\Dewafu',
    cards: [
      ['assessment', 'Für welche Projekte eignet sich das redundante WF-026 Invisible Smart Lock?', '5. September 2026', 'Für <strong>Projektbeschaffung und Betriebsteams</strong>: Bewerten Sie <strong>WF-026 mit Doppelsystem und zwei Motoren</strong> anhand von Türbedingungen, Musterprüfung, Stromversorgung, Wartungsbereitschaft und Gesamtbetriebskosten.'],
      ['rfq', 'Was vor einer Anfrage für unsichtbare Smart Locks benötigt wird', '2. September 2026', 'Für <strong>Einkaufsteams, Händler und Marken</strong>: Bereiten Sie <strong>Türdaten, Mengen, Öffnungsarten und Zielmarktanforderungen</strong> vor, damit Lieferanten Konfiguration, Muster, Verpackung und Supportumfang belastbar anbieten können.'],
      ['firstOrder', 'Erste Bestellung für unsichtbare Smart Locks: SKU, Muster, Verpackung und Service', '29. August 2026', 'Für <strong>Händler und Markeninhaber</strong>: Verbinden Sie <strong>SKU-Auswahl, Musterfreigabe, Verpackung, Montageunterstützung und After-Sales</strong> zu einer klaren Erstbestellungs-Checkliste, bevor Stückzahlen festgelegt werden.']
    ]
  },
  {
    root: 'D:\\WebSite\\FRwafu',
    cards: [
      ['assessment', 'Quels projets conviennent à la serrure invisible WF-026 à système redondant ?', '5 septembre 2026', 'Pour les <strong>équipes achats et exploitation</strong> : évaluez l’<strong>architecture WF-026 à double système et double moteur</strong> selon la porte, l’échantillon, l’alimentation, la maintenance et le coût total de possession.'],
      ['rfq', 'Que préparer avant de demander un prix pour des serrures intelligentes invisibles', '2 septembre 2026', 'Pour les <strong>acheteurs, distributeurs et marques</strong> : préparez les <strong>données de porte, volumes, modes d’accès et exigences du marché cible</strong> afin de cadrer configuration, échantillon, emballage et support.'],
      ['firstOrder', 'Première commande de serrures invisibles : SKU, échantillons, emballage et service', '29 août 2026', 'Pour les <strong>distributeurs et propriétaires de marque</strong> : réunissez <strong>choix des SKU, validation des échantillons, emballage, assistance d’installation et après-vente</strong> avant de fixer les quantités de la première commande.']
    ]
  },
  {
    root: 'D:\\WebSite\\Itwafu',
    cards: [
      ['assessment', 'Per quali progetti è adatta la serratura invisibile ridondante WF-026?', '5 settembre 2026', 'Per i <strong>team acquisti e operativi</strong>: valutate l’<strong>architettura WF-026 a doppio sistema e doppio motore</strong> in base a porta, campione, alimentazione, manutenzione e costo totale di possesso.'],
      ['rfq', 'Cosa preparare prima di richiedere un preventivo per serrature intelligenti invisibili', '2 settembre 2026', 'Per <strong>acquirenti, distributori e brand</strong>: preparate <strong>dati della porta, quantità, metodi di accesso e requisiti del mercato target</strong> per definire correttamente configurazione, campione, imballo e supporto.'],
      ['firstOrder', 'Primo ordine di serrature invisibili: SKU, campioni, imballo e assistenza', '29 agosto 2026', 'Per <strong>distributori e proprietari di brand</strong>: riunite <strong>scelta SKU, approvazione del campione, imballo, supporto all’installazione e post-vendita</strong> in una checklist prima di fissare le quantità iniziali.']
    ]
  },
  {
    root: 'D:\\WebSite\\Ptwafu',
    compactTechnology: true,
    cards: [
      ['assessment', 'Para que projetos é adequada a fechadura invisível redundante WF-026?', '5 de setembro de 2026', 'Para <strong>equipas de compras e operação</strong>: avalie a <strong>arquitetura WF-026 com sistema duplo e dois motores</strong> segundo a porta, a validação da amostra, a alimentação, a manutenção e o custo total de propriedade.'],
      ['rfq', 'O que preparar antes de pedir cotação para fechaduras inteligentes invisíveis', '2 de setembro de 2026', 'Para <strong>compradores, distribuidores e marcas</strong>: prepare <strong>dados da porta, quantidades, métodos de acesso e requisitos do mercado-alvo</strong> para definir configuração, amostra, embalagem e suporte com clareza.'],
      ['firstOrder', 'Primeiro pedido de fechaduras invisíveis: SKU, amostras, embalagem e assistência', '29 de agosto de 2026', 'Para <strong>distribuidores e proprietários de marca</strong>: una <strong>seleção de SKU, aprovação de amostras, embalagem, apoio à instalação e pós-venda</strong> numa checklist antes de fechar as quantidades do primeiro pedido.']
    ]
  },
  {
    root: 'D:\\WebSite\\Ruwafu',
    cards: [
      ['assessment', 'Для каких проектов подходит скрытый замок WF-026 с резервной архитектурой?', '5 сентября 2026 г.', 'Для <strong>команд закупок и эксплуатации</strong>: оцените <strong>WF-026 с двумя системами и двумя моторами</strong> по условиям двери, проверке образца, питанию, готовности к обслуживанию и совокупной стоимости владения.'],
      ['rfq', 'Что подготовить перед запросом цены на скрытые умные замки', '2 сентября 2026 г.', 'Для <strong>закупщиков, дистрибьюторов и брендов</strong>: подготовьте <strong>данные о двери, объёмы, способы доступа и требования целевого рынка</strong>, чтобы согласовать конфигурацию, образец, упаковку и объём поддержки.'],
      ['firstOrder', 'Первый заказ скрытых умных замков: SKU, образцы, упаковка и сервис', '29 августа 2026 г.', 'Для <strong>дистрибьюторов и владельцев бренда</strong>: объедините <strong>выбор SKU, подтверждение образца, упаковку, поддержку монтажа и послепродажный сервис</strong> в единый чек-лист до фиксации стартового объёма.']
    ]
  },
  {
    root: 'D:\\WebSite\\Spainwafu',
    compactTechnology: true,
    cards: [
      ['assessment', '¿Para qué proyectos es adecuada la cerradura invisible redundante WF-026?', '5 de septiembre de 2026', 'Para <strong>equipos de compras y operación</strong>: evalúe la <strong>arquitectura WF-026 de doble sistema y doble motor</strong> según la puerta, la validación de muestra, la alimentación, el mantenimiento y el coste total de propiedad.'],
      ['rfq', 'Qué preparar antes de solicitar una cotización para cerraduras inteligentes invisibles', '2 de septiembre de 2026', 'Para <strong>compradores, distribuidores y marcas</strong>: prepare <strong>datos de puerta, cantidades, métodos de acceso y requisitos del mercado objetivo</strong> para definir con claridad la configuración, muestra, embalaje y soporte.'],
      ['firstOrder', 'Primer pedido de cerraduras invisibles: SKU, muestras, embalaje y servicio', '29 de agosto de 2026', 'Para <strong>distribuidores y propietarios de marca</strong>: reúna <strong>selección de SKU, aprobación de muestra, embalaje, apoyo de instalación y posventa</strong> en una sola checklist antes de fijar las cantidades iniciales.']
    ]
  }
];

function buildHomepageCard([articleKey, title, date, description]) {
  return `<a href="./resource/${articles[articleKey]}"><div class="news-item"><div class="news-item-content"><h3 class="news-item-title">${title}</h3><p class="news-item-date">${date}</p><p class="news-item-desc">${description}</p></div></div></a>`;
}

function buildTechnologyCard([articleKey, title, date, description], compactTechnology) {
  if (compactTechnology) {
    const datetime = articleKey === 'assessment' ? '2026-09-05' : '2026-09-02';
    return `<li class="news-item"><a class="news-link" href="./${articles[articleKey]}"><div class="news-txt"><h3>${title}</h3><time datetime="${datetime}">${date}</time><p>${description}</p></div></a></li>`;
  }
  return `<li class="news-item"><a href="./${articles[articleKey]}" class="news-link"><div class="news-txt"><h2 class="news-title">${title}</h2><p class="news-date">${date}</p><p class="news-desc">${description}</p></div></a></li>`;
}

for (const site of sites) {
  const indexFile = path.join(site.root, 'index.html');
  const technologyFile = path.join(site.root, 'resource', 'technology.html');
  let index = fs.readFileSync(indexFile, 'utf8');
  let technology = fs.readFileSync(technologyFile, 'utf8');

  const homeCards = site.cards.map(buildHomepageCard).join('');
  const indexPattern = /(<div class="news-list tech-articles-list">)[\s\S]*?(<\/div>\s*<\/section>\s*<section class="reviews-section")/;
  if (!indexPattern.test(index)) throw new Error(`Homepage technical article section not found: ${indexFile}`);
  index = index.replace(indexPattern, `$1${homeCards}$2`);

  for (const card of site.cards.slice(0, 2)) {
    const slug = articles[card[0]];
    const itemPattern = site.compactTechnology
      ? new RegExp(`<li class="news-item"><a class="news-link" href="\\./${slug}">[\\s\\S]*?<\\/li>`)
      : new RegExp(`<li class="news-item"><a href="\\./${slug}" class="news-link">[\\s\\S]*?<\\/li>`);
    if (!itemPattern.test(technology)) throw new Error(`Technology card not found: ${technologyFile} (${slug})`);
    technology = technology.replace(itemPattern, buildTechnologyCard(card, site.compactTechnology));
  }

  fs.writeFileSync(indexFile, index, 'utf8');
  fs.writeFileSync(technologyFile, technology, 'utf8');

  const homepageHrefs = [...index.matchAll(/<div class="news-list tech-articles-list">([\s\S]*?)<\/div>\s*<\/section>/g)][0]?.[1]?.match(/href="\.\/resource\//g) || [];
  if (homepageHrefs.length !== 3) throw new Error(`Homepage must contain exactly three technical article cards: ${indexFile}`);
  for (const card of site.cards.slice(0, 2)) {
    const blockPattern = site.compactTechnology
      ? new RegExp(`<li class="news-item"><a class="news-link" href="\\./${articles[card[0]]}">([\\s\\S]*?)<\\/li>`)
      : new RegExp(`<li class="news-item"><a href="\\./${articles[card[0]]}" class="news-link">([\\s\\S]*?)<\\/li>`);
    const block = technology.match(blockPattern)?.[1] || '';
    if (!block.includes('<strong>')) throw new Error(`Technology summary lacks emphasized terms: ${technologyFile}`);
  }
}

console.log(`Updated homepage and technology-list article cards for ${sites.length} external language sites.`);
