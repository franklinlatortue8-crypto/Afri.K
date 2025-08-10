export interface Country {
  id: string;
  name: string;
  fullName: string;
  position: [number, number, number];
  geometry?: any;
  risks: Risk[];
  description: string;
}

export interface Risk {
  id: string;
  name: string;
  category: 'natural' | 'health' | 'security' | 'political' | 'economic';
  level: 'low' | 'medium' | 'high';
  description: string;
}

export interface Report {
  country: string;
  selectedRisks: Risk[];
  duration: number;
  generatedAt: Date;
  summary: string;
}

export interface ViewState {
  mode: 'overview' | 'country';
  selectedCountry?: Country;
  isZooming: boolean;
}