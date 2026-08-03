import React from 'react';
import { useNavigate } from 'react-router-dom';
import dealsImg1 from "../../assets/category-8.jpg";
import dealsImg2 from "../../assets/png1.jpg";

const DealsGrid = () => {
  const navigate = useNavigate();

  const handleShopNow = (category) => {
    navigate('/shop', {
      state: { category },
      replace: true // This prevents adding to browser history
    });
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>

      {/* New Arrivals Heading with Hover Effect */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          cursor: 'default'
        }}
        onMouseEnter={e => {
          e.currentTarget.querySelector('h2').style.color = '#4f46e5';
          e.currentTarget.querySelector('p').style.color = '#4f46e5';
        }}
        onMouseLeave={e => {
          e.currentTarget.querySelector('h2').style.color = '#333';
          e.currentTarget.querySelector('p').style.color = '#666';
        }}
      >
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#333',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'color 0.3s ease'
        }}>
          New Arrivals
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          transition: 'color 0.3s ease'
        }}>
          Discover our latest collection
        </p>
      </div>

      {/* Grid Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {/* First Grid Item with Hover Effects */}
        <div
          style={{
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
            e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
            e.currentTarget.querySelector('button').style.backgroundColor = '#4338ca';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            e.currentTarget.querySelector('button').style.backgroundColor = '#4f46e5';
          }}
        >
          <div style={{
            height: '300px',
            overflow: 'hidden'
          }}>
            <img
              src={dealsImg1}
              alt="For boys collection"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease'
              }}
            />
          </div>
          <div style={{
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '10px',
              color: '#222',
              transition: 'color 0.3s ease'
            }}>
              For Boys
            </h3>
            <p style={{
              color: '#666',
              marginBottom: '20px',
              transition: 'color 0.3s ease'
            }}>
              Discover our fresh designs for boys
            </p>
            <button
              onClick={() => handleShopNow('New Arrivals (Boys)')}
              style={{
                backgroundColor: '#4f46e5',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              Shop NOW
            </button>
          </div>
        </div>

        {/* Second Grid Item with Hover Effects */}
        <div
          style={{
            background: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
            e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
            e.currentTarget.querySelector('button').style.backgroundColor = '#4338ca';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
            e.currentTarget.querySelector('button').style.backgroundColor = '#4f46e5';
          }}
        >
          <div style={{
            height: '300px',
            overflow: 'hidden'
          }}>
            <img
              src={dealsImg2}
              alt="Girls' special collection"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease'
              }}
            />
          </div>
          <div style={{
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '10px',
              color: '#222',
              transition: 'color 0.3s ease'
            }}>
              Girls' Specials
            </h3>
            <p style={{
              color: '#666',
              marginBottom: '20px',
              transition: 'color 0.3s ease'
            }}>
              Crazy outfits for pretty ones
            </p>
            <button
              onClick={() => handleShopNow('New Arrivals (Girls)')}
              style={{
                backgroundColor: '#4f46e5',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              Shop NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsGrid;