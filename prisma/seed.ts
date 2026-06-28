import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database…')

  // Admin user
  const password = await bcrypt.hash('123654', 12)
  const user = await prisma.user.upsert({
    where: { email: 'zysistem@icloud.com' },
    update: { password },
    create: {
      email: 'zysistem@icloud.com',
      name: 'Admin',
      password,
      role: 'admin',
    },
  })
  console.log('✓ Admin user:', user.email)

  // Default settings
  await prisma.tourSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'Expert Astravel',
      companyAddress: 'Calle Gran Vía 28, Madrid',
      companyPhone: '+34 911 230 045',
      companyWebsite: 'expertastravel.com',
      companyEmail: 'info@expertastravel.com',
      primaryColor: '#1B2A4A',
      defaultCurrency: 'EUR',
      defaultLanguage: 'en',
      timezone: 'Europe/Madrid',
    },
  })
  console.log('✓ Settings created')

  // Languages
  const langs = [
    { code: 'en', label: 'English', isDefault: true, order: 0 },
    { code: 'es', label: 'Español', isDefault: false, order: 1 },
    { code: 'tr', label: 'Türkçe', isDefault: false, order: 2 },
    { code: 'fr', label: 'Français', isDefault: false, order: 3 },
  ]
  for (const l of langs) {
    await prisma.language.upsert({ where: { code: l.code }, update: {}, create: { ...l, isActive: true } })
  }
  console.log('✓ Languages seeded')

  // Visit Points
  const visitPoints = [
    { names: { en: 'Hagia Sophia', es: 'Santa Sofía', tr: 'Ayasofya' }, descriptions: { en: 'Ancient basilica and mosque, symbol of Istanbul.', es: 'Antigua basílica y mezquita, símbolo de Estambul.' }, category: 'Landmark' },
    { names: { en: 'Blue Mosque', es: 'Mezquita Azul', tr: 'Sultanahmet Camii' }, descriptions: { en: 'Sultan Ahmed Mosque with six minarets.', es: 'Mezquita del Sultán Ahmed con seis minaretes.' }, category: 'Religious' },
    { names: { en: 'Topkapı Palace', es: 'Palacio Topkapı', tr: 'Topkapı Sarayı' }, descriptions: { en: 'Residence of the Ottoman sultans.', es: 'Residencia de los sultanes otomanos.' }, category: 'Palace' },
    { names: { en: 'Grand Bazaar', es: 'Gran Bazar', tr: 'Kapalıçarşı' }, descriptions: { en: 'One of the largest covered markets in the world.', es: 'Uno de los mercados cubiertos más grandes del mundo.' }, category: 'Market' },
    { names: { en: 'Göreme Open-Air Museum', es: 'Museo al aire libre de Göreme' }, descriptions: { en: 'Rock-cut churches with Byzantine frescoes.', es: 'Iglesias rupestres y frescos bizantinos.' }, category: 'Heritage' },
    { names: { en: 'Hot-Air Balloon Flight', es: 'Vuelo en Globo', tr: 'Balon Turu' }, descriptions: { en: 'Sunrise flight over the fairy chimneys of Cappadocia.', es: 'Vuelo al amanecer sobre las chimeneas de hadas de Capadocia.' }, category: 'Experience' },
  ]
  for (const vp of visitPoints) {
    await prisma.visitPoint.create({ data: { names: vp.names, descriptions: vp.descriptions, category: vp.category } })
  }
  console.log('✓ Visit points seeded')

  // Accommodations
  const accommodations = [
    { names: { en: 'Four Seasons Sultanahmet', es: 'Four Seasons Sultanahmet' }, address: 'Istanbul · Historic peninsula', stars: 5 },
    { names: { en: 'Museum Hotel Cappadocia', es: 'Museum Hotel Capadocia' }, address: 'Uçhisar · Cave suites', stars: 5 },
    { names: { en: 'Argos in Cappadocia' }, address: 'Uçhisar · Boutique', stars: 5 },
  ]
  for (const acc of accommodations) {
    await prisma.accommodation.create({ data: acc })
  }
  console.log('✓ Accommodations seeded')

  // Airlines
  await prisma.airline.createMany({
    data: [
      { names: { en: 'Turkish Airlines', es: 'Turkish Airlines' }, iataCode: 'TK' },
      { names: { en: 'Iberia' }, iataCode: 'IB' },
      { names: { en: 'Pegasus Airlines' }, iataCode: 'PC' },
    ],
  })
  console.log('✓ Airlines seeded')

  // Inclusion items
  const inclusions = [
    { labels: { en: 'Airport transfers (private)', es: 'Traslados al aeropuerto (privados)', tr: 'Özel havalimanı transferleri' }, defaultType: 'included' },
    { labels: { en: 'Daily breakfast', es: 'Desayuno diario', tr: 'Günlük kahvaltı' }, defaultType: 'included' },
    { labels: { en: 'Licensed EN/ES guide', es: 'Guía titulado EN/ES' }, defaultType: 'included' },
    { labels: { en: 'All entrance fees', es: 'Todas las entradas' }, defaultType: 'included' },
    { labels: { en: 'Hot-air balloon flight', es: 'Vuelo en globo aerostático' }, defaultType: 'included' },
    { labels: { en: 'Bosphorus dinner cruise', es: 'Crucero-cena por el Bósforo' }, defaultType: 'included' },
    { labels: { en: 'International flights', es: 'Vuelos internacionales' }, defaultType: 'excluded' },
    { labels: { en: 'Travel insurance', es: 'Seguro de viaje' }, defaultType: 'excluded' },
    { labels: { en: 'Personal expenses', es: 'Gastos personales' }, defaultType: 'excluded' },
    { labels: { en: 'Lunches & dinners (unless noted)', es: 'Almuerzos y cenas (salvo indicación)' }, defaultType: 'excluded' },
    { labels: { en: 'Gratuities & tips', es: 'Propinas' }, defaultType: 'excluded' },
  ]
  for (const item of inclusions) {
    await prisma.inclusionItem.create({ data: item })
  }
  console.log('✓ Inclusion items seeded')

  // Cancellation policies
  await prisma.cancellationPolicy.createMany({
    data: [
      {
        titles: { en: 'Flexible — free cancellation up to 30 days', es: 'Flexible — cancelación gratis hasta 30 días' },
        contents: { en: 'Full refund if cancelled 30+ days before departure. 50% refund within 15–29 days. No refund within 14 days.', es: 'Reembolso total si se cancela 30+ días antes. 50% entre 15–29 días. Sin reembolso dentro de 14 días.' },
        isDefault: true,
      },
      {
        titles: { en: 'Standard policy', es: 'Política estándar' },
        contents: { en: 'Deposit non-refundable. 70% refund 21+ days prior, 30% within 20 days.', es: 'Depósito no reembolsable. 70% con 21+ días, 30% dentro de 20 días.' },
        isDefault: false,
      },
    ],
  })
  console.log('✓ Cancellation policies seeded')

  console.log('\n✅ Seed complete!')
  console.log('   Login: zysistem@icloud.com / 123654')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
