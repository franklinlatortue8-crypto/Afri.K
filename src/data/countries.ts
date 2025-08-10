import { Country, Risk } from '../types';

const commonRisks: Risk[] = [
  {
    id: 'natural-disasters',
    name: 'Catastrophes naturelles',
    category: 'natural',
    level: 'medium',
    description: 'Risques liés aux phénomènes naturels (inondations, sécheresses, séismes)'
  },
  {
    id: 'health-risks',
    name: 'Risques sanitaires',
    category: 'health',
    level: 'medium',
    description: 'Maladies tropicales, qualité des soins médicaux'
  },
  {
    id: 'security-risks',
    name: 'Risques sécuritaires',
    category: 'security',
    level: 'medium',
    description: 'Criminalité, terrorisme, instabilité régionale'
  },
  {
    id: 'political-instability',
    name: 'Instabilité politique',
    category: 'political',
    level: 'medium',
    description: 'Changements politiques, manifestations, coups d\'état'
  },
  {
    id: 'economic-risks',
    name: 'Risques économiques',
    category: 'economic',
    level: 'medium',
    description: 'Inflation, dévaluation monétaire, difficultés bancaires'
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure déficiente',
    category: 'economic',
    level: 'medium',
    description: 'Routes, télécommunications, électricité'
  }
];

export const africanCountries: Country[] = [
  {
    id: 'nigeria',
    name: 'Nigeria',
    fullName: 'République fédérale du Nigeria',
    position: [8.0, 10.0, 1.2],
    risks: commonRisks,
    description: 'Plus grande économie d\'Afrique avec une population de plus de 200 millions d\'habitants.'
  },
  {
    id: 'egypt',
    name: 'Égypte',
    fullName: 'République arabe d\'Égypte',
    position: [30.0, 26.0, 1.2],
    risks: commonRisks.map(r => ({...r, level: r.id === 'political-instability' ? 'high' : r.level})),
    description: 'Carrefour entre l\'Afrique et le Moyen-Orient, riche histoire ancienne.'
  },
  {
    id: 'south-africa',
    name: 'Afrique du Sud',
    fullName: 'République d\'Afrique du Sud',
    position: [25.0, -29.0, 1.2],
    risks: commonRisks.map(r => ({...r, level: r.id === 'security-risks' ? 'high' : r.level})),
    description: 'Économie la plus développée d\'Afrique australe, nation arc-en-ciel.'
  },
  {
    id: 'kenya',
    name: 'Kenya',
    fullName: 'République du Kenya',
    position: [38.0, 1.0, 1.2],
    risks: commonRisks,
    description: 'Hub économique de l\'Afrique de l\'Est, célèbre pour ses safaris.'
  },
  {
    id: 'morocco',
    name: 'Maroc',
    fullName: 'Royaume du Maroc',
    position: [-8.0, 32.0, 1.2],
    risks: commonRisks.map(r => ({...r, level: r.id === 'natural-disasters' ? 'low' : r.level})),
    description: 'Porte d\'entrée de l\'Afrique, riche patrimoine culturel.'
  },
  {
    id: 'ghana',
    name: 'Ghana',
    fullName: 'République du Ghana',
    position: [-2.0, 8.0, 1.2],
    risks: commonRisks.map(r => ({...r, level: r.id === 'political-instability' ? 'low' : r.level})),
    description: 'Démocratie stable d\'Afrique de l\'Ouest, producteur d\'or et de cacao.'
  },
  {
    id: 'ethiopia',
    name: 'Éthiopie',
    fullName: 'République démocratique fédérale d\'Éthiopie',
    position: [38.0, 8.0, 1.2],
    risks: commonRisks.map(r => ({...r, level: r.id === 'natural-disasters' ? 'high' : r.level})),
    description: 'Berceau de l\'humanité, siège de l\'Union africaine.'
  },
  {
    id: 'senegal',
    name: 'Sénégal',
    fullName: 'République du Sénégal',
    position: [-14.0, 14.0, 1.2],
    risks: commonRisks.map(r => ({...r, level: r.id === 'political-instability' ? 'low' : r.level})),
    description: 'Démocratie stable, centre culturel de l\'Afrique francophone.'
  },
  {
    id: 'tanzania',
    name: 'Tanzanie',
    fullName: 'République unie de Tanzanie',
    position: [35.0, -6.0, 1.2],
    risks: commonRisks,
    description: 'Abritant le Kilimandjaro et le parc du Serengeti.'
  },
  {
    id: 'algeria',
    name: 'Algérie',
    fullName: 'République algérienne démocratique et populaire',
    position: [2.0, 28.0, 1.2],
    risks: commonRisks.map(r => ({...r, level: r.id === 'political-instability' ? 'high' : r.level})),
    description: 'Plus grand pays d\'Afrique, riche en ressources énergétiques.'
  }
];