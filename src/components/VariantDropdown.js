import React, { useState, useRef, useEffect } from 'react';

const VariantDropdown = ({ sizes, selectedSizeIndex, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!sizes || sizes.length === 0) return null;

  const activeSize = sizes[selectedSizeIndex] || sizes[0];
  const formatPrice = (p) => Number(p || 0).toLocaleString('en-IN');
  const sizeText = activeSize.sizeLabel || activeSize.size || "";

  return (
    <div className="variant-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '100%', marginBottom: '10px' }}>
      
      {/* Active Selection (Toggle) */}
      <div 
        className="variant-pill active"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div className="pill-left" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="pill-price">₹{formatPrice(activeSize.price)}</span>
          {sizeText && <span className="pill-dot">•</span>}
          {sizeText && <span className="pill-size">{sizeText}</span>}
        </div>
        <div className="pill-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="pill-qty">Qty {activeSize.quantity || 1}</span>
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '12px', color: '#2451b2' }} />
        </div>
      </div>

      {/* Dropdown Menu (Absolute) */}
      {isOpen && (
        <div 
          className="variant-dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            marginTop: '4px',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e0e5ec',
            zIndex: 9999,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {sizes.map((s, idx) => {
            const isSelected = selectedSizeIndex === idx;
            const currentSizeText = s.sizeLabel || s.size || "";
            return (
              <div 
                key={idx}
                className={`variant-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect(idx);
                  setIsOpen(false);
                }}
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderBottom: idx === sizes.length - 1 ? 'none' : '1px solid #f1f1f1',
                  backgroundColor: isSelected ? '#f4f7fb' : '#fff'
                }}
              >
                <div className="pill-left" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="pill-price" style={{ color: isSelected ? '#2451b2' : '#3b4256', fontWeight: 700, fontSize: '14px' }}>
                    ₹{formatPrice(s.price)}
                  </span>
                  {currentSizeText && <span className="pill-dot" style={{ color: isSelected ? '#8da1cf' : '#a0a8b5', fontSize: '12px' }}>•</span>}
                  {currentSizeText && <span className="pill-size" style={{ color: isSelected ? '#2451b2' : '#3b4256', fontWeight: 700, fontSize: '14px' }}>
                    {currentSizeText}
                  </span>}
                </div>
                <div className="pill-right">
                  <span className="pill-qty" style={{ color: '#6e7a91', fontWeight: 600, fontSize: '13px' }}>
                    Qty {s.quantity || 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VariantDropdown;
