import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../state/DataContext';
import { OPPORTUNITY_STAGES } from '../data/constants';
import { formatCurrency } from '../data/utils';
import { OpportunityStage } from '../data/models';

const OpportunityPipeline: React.FC = () => {
  const { opportunities, accounts, pipelineValue } = useData();

  if (opportunities.length === 0) {
    return (
      <div className="card">
        <h2>Pipeline</h2>
        <div className="empty-state">
          No opportunities in the pipeline yet.{' '}
          <Link to="/opportunities/new" style={{ color: '#2563eb' }}>
            Create your first deal
          </Link>
          .
        </div>
      </div>
    );
  }

  const grouped = OPPORTUNITY_STAGES.reduce<Record<OpportunityStage, typeof opportunities>>(
    (acc, stage) => {
      acc[stage] = opportunities.filter((opp) => opp.stage === stage);
      return acc;
    },
    {
      Prospecting: [],
      Qualification: [],
      Proposal: [],
      Negotiation: [],
      'Closed Won': [],
      'Closed Lost': []
    }
  );

  const statusColor = (status: string) => {
    if (status === 'Won') return '#15803d';
    if (status === 'Lost') return '#b91c1c';
    return '#1d4ed8';
  };

  return (
    <div className="grid" style={{ gap: '1.5rem' }}>
      <section className="page-header">
        <div>
          <h2>Pipeline Kanban</h2>
          <p>Total open pipeline value: {formatCurrency(pipelineValue)}</p>
        </div>
        <Link to="/opportunities/new" className="button">
          Add opportunity
        </Link>
      </section>

      <section className="pipeline-board">
        {OPPORTUNITY_STAGES.map((stage) => (
          <div key={stage} className="pipeline-column">
            <h3>
              {stage}
              <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                {grouped[stage].length}
              </span>
            </h3>
            {grouped[stage].length === 0 ? (
              <div className="empty-state">No deals here yet.</div>
            ) : (
              grouped[stage].map((opp) => {
                const account = accounts.find((acct) => acct.id === opp.accountId);
                return (
                  <div key={opp.id} className="pipeline-card">
                    <Link to={`/opportunities/${opp.id}`} style={{ fontWeight: 600 }}>
                      {opp.name}
                    </Link>
                    <p style={{ margin: '0.35rem 0 0' }}>{account ? account.name : '—'}</p>
                    <p style={{ margin: '0.5rem 0 0', fontWeight: 600 }}>{formatCurrency(opp.amount)}</p>
                    <span style={{ color: statusColor(opp.status), fontSize: '0.85rem' }}>{opp.status}</span>
                  </div>
                );
              })
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default OpportunityPipeline;
