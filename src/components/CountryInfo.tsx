import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2 } from 'lucide-react';
import { Country, Risk, Report } from '../types';

interface CountryInfoProps {
  country: Country;
  onClose: () => void;
  isVisible: boolean;
}

export const CountryInfo: React.FC<CountryInfoProps> = ({ 
  country, 
  onClose, 
  isVisible 
}) => {
  const [selectedRisks, setSelectedRisks] = useState<Risk[]>([]);
  const [duration, setDuration] = useState(7);
  const [report, setReport] = useState<Report | null>(null);
  const [showReport, setShowReport] = useState(false);

  const handleRiskToggle = (risk: Risk) => {
    setSelectedRisks(prev => {
      const exists = prev.find(r => r.id === risk.id);
      if (exists) {
        return prev.filter(r => r.id !== risk.id);
      } else {
        return [...prev, risk];
      }
    });
  };

  const generateReport = () => {
    const newReport: Report = {
      country: country.fullName,
      selectedRisks,
      duration,
      generatedAt: new Date(),
      summary: generateSummary()
    };
    
    setReport(newReport);
    setShowReport(true);
  };

  const generateSummary = () => {
    const riskLevels = selectedRisks.reduce((acc, risk) => {
      acc[risk.level] = (acc[risk.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let riskAssessment = 'Risque global: ';
    if (riskLevels.high > 0) {
      riskAssessment += 'ÉLEVÉ';
    } else if (riskLevels.medium > 2) {
      riskAssessment += 'MODÉRÉ À ÉLEVÉ';
    } else {
      riskAssessment += 'MODÉRÉ';
    }

    const recommendations = [
      `Durée de mission: ${duration} jour${duration > 1 ? 's' : ''}`,
      'Souscription d\'une assurance voyage recommandée',
      'Vérification des vaccinations obligatoires',
      'Consultation des derniers avis consulaires'
    ];

    return `${riskAssessment}\n\nRecommandations principales:\n${recommendations.map(r => `• ${r}`).join('\n')}`;
  };

  const exportReport = () => {
    if (!report) return;

    const reportText = `
RAPPORT D'ANALYSE - ${report.country}
${'='.repeat(50)}

Date de génération: ${report.generatedAt.toLocaleString('fr-FR')}
Durée de mission: ${report.duration} jour(s)

RISQUES IDENTIFIÉS:
${report.selectedRisks.map(risk => 
  `• ${risk.name} (${risk.level.toUpperCase()}): ${risk.description}`
).join('\n')}

SYNTHÈSE:
${report.summary}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${country.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="country-info-overlay" onClick={onClose} />
      
      {/* Panel principal */}
      <div className="country-info-panel">
        <div className="country-info__header">
          <div>
            <h2 className="country-info__title">{country.name}</h2>
            <p className="country-info__subtitle">{country.fullName}</p>
          </div>
          <button 
            onClick={onClose}
            className="country-info__close-btn"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="country-info__content">
          <p className="country-info__description">
            {country.description}
          </p>

          {!showReport ? (
            <>
              <div className="country-info__section">
                <h3 className="country-info__section-title">
                  Évaluation des risques
                </h3>
                <div className="risks-grid">
                  {country.risks.map(risk => (
                    <label key={risk.id} className="risk-item">
                      <input
                        type="checkbox"
                        checked={selectedRisks.some(r => r.id === risk.id)}
                        onChange={() => handleRiskToggle(risk)}
                        className="risk-item__checkbox"
                      />
                      <div className="risk-item__content">
                        <div className="risk-item__header">
                          <span className="risk-item__name">{risk.name}</span>
                          <span className={`risk-item__level risk-item__level--${risk.level}`}>
                            {risk.level}
                          </span>
                        </div>
                        <p className="risk-item__description">{risk.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="country-info__section">
                <h3 className="country-info__section-title">
                  Durée de la mission
                </h3>
                <div className="duration-slider">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="duration-slider__input"
                  />
                  <div className="duration-slider__display">
                    <span className="duration-slider__value">{duration}</span>
                    <span className="duration-slider__unit">
                      jour{duration > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={generateReport}
                disabled={selectedRisks.length === 0}
                className="country-info__generate-btn"
              >
                <FileText className="w-5 h-5" />
                Générer un rapport
                {selectedRisks.length > 0 && (
                  <span className="country-info__selected-count">
                    ({selectedRisks.length})
                  </span>
                )}
              </button>
            </>
          ) : (
            <div className="report-view">
              <div className="report-view__header">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <h3 className="report-view__title">Rapport généré</h3>
                </div>
                <button
                  onClick={exportReport}
                  className="report-view__export-btn"
                  title="Exporter le rapport"
                >
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
              
              <div className="report-view__content">
                <div className="report-view__summary">
                  <h4>Synthèse</h4>
                  <pre className="report-view__summary-text">{report?.summary}</pre>
                </div>
                
                <div className="report-view__details">
                  <h4>Détails de l'analyse</h4>
                  <p><strong>Pays:</strong> {report?.country}</p>
                  <p><strong>Durée:</strong> {report?.duration} jour(s)</p>
                  <p><strong>Nombre de risques identifiés:</strong> {report?.selectedRisks.length}</p>
                  <p><strong>Date de génération:</strong> {report?.generatedAt.toLocaleString('fr-FR')}</p>
                </div>
              </div>

              <div className="report-view__actions">
                <button
                  onClick={() => setShowReport(false)}
                  className="report-view__back-btn"
                >
                  Modifier l'analyse
                </button>
                <button
                  onClick={onClose}
                  className="report-view__close-btn"
                >
                  Terminer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};