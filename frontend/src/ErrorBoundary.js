import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
          color: '#d1d5db',
        }}>
          <h2 style={{ color: '#ec4899', marginBottom: '16px' }}>Something went wrong</h2>
          <pre style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '600px',
            overflow: 'auto',
            fontSize: '0.85rem',
            color: '#a78bfa',
          }}>
            {this.state.error.toString()}
          </pre>
          <button
            style={{
              marginTop: '24px',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
