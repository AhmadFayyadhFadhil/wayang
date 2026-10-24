import React from 'react';

/**
 * Resilient Error Boundary untuk Komponen Panggung & Media Wayangverse
 * Mencegah Black Screen of Death dan menyediakan tombol pulihkan panggung
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Wayangverse Boundary Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            background: 'radial-gradient(circle at center, #1e140d 0%, #0d0805 100%)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '16px',
            color: '#fcfaf2',
            textAlign: 'center',
            minHeight: '280px',
            margin: '20px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#eab308',
              boxShadow: '0 0 12px #eab308',
              marginBottom: '16px',
            }}
          />
          <h3
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '18px',
              fontWeight: '800',
              color: '#fef08a',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            Kendala Pada Panggung Digital
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: '#d6c5b3',
              maxWidth: '460px',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}
          >
            Sistem mendeteksi kendala rendering komponen panggung. Silakan muat ulang tampilan untuk memulihkan pagelaran.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #c59b27 0%, #8b6814 100%)',
                color: '#1a1006',
                fontWeight: 700,
                fontSize: '12px',
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Pulihkan Tampilan
            </button>
            {this.props.onClose && (
              <button
                onClick={this.props.onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#e5e7eb',
                  fontSize: '12px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                }}
              >
                Tutup Jendela
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
