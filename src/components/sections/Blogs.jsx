import { useState, useEffect, useRef } from 'react';

const categories = ['All', 'Maintenance', 'New Launches', 'Riding Tips', 'Accessories', 'Tech & Features'];

const posts = [
  {
    id: 1,
    category: 'Maintenance',
    tag: 'Must Read',
    title: 'How Often Should You Service Your Hero Splendor?',
    excerpt: 'Regular servicing isn\'t just about keeping your bike running—it\'s about safety, performance, and protecting your investment. Here\'s the definitive Hero servicing schedule every owner needs to know.',
    author: 'Rajesh Kumar',
    role: 'Senior Technician',
    date: 'May 2, 2025',
    readTime: '5 min read',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/service-journey-assets/overview/service-delivers/hero-service-image-mob.png',
    accent: '#FF0000',
    featured: true,
  },
  {
    id: 2,
    category: 'New Launches',
    tag: 'Just In',
    title: 'Hero Xpulse 210: Everything You Need to Know',
    excerpt: 'The all-new Xpulse 210 redefines adventure biking in India. Bigger engine, longer suspension travel, and the liquid-cooled unit from the Karizma. We break down every spec.',
    author: 'Priya Sharma',
    role: 'Product Specialist',
    date: 'Apr 28, 2025',
    readTime: '7 min read',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuvUElbfX2RicB4calILJUNKXyvq6cLl0A7g&s',
    accent: '#111',
    featured: false,
  },
  {
    id: 3,
    category: 'Riding Tips',
    tag: 'Pro Tip',
    title: '10 Monsoon Riding Tips That Could Save Your Life',
    excerpt: 'Wet roads, reduced visibility, and slippery surfaces demand a completely different riding approach. Our expert riders share the ten rules they never break when the skies open up.',
    author: 'Arun Singh',
    role: 'Riding Coach',
    date: 'Apr 20, 2025',
    readTime: '6 min read',
    image: 'https://cdn-fastly.motorcycle.com/media/2023/02/23/8886931/ten-motorcycle-riding-tips-tricks-and-techniques.jpg?size=414x575&nocrop=1',
    accent: '#FF0000',
    featured: false,
  },
  {
    id: 4,
    category: 'Accessories',
    tag: 'Upgrade',
    title: 'Top 8 Accessories to Transform Your Hero Destini 125',
    excerpt: 'From crash guards to phone mounts and tank bags, we\'ve curated the best Hero-approved accessories that add function, style, and safety to your daily commuter.',
    author: 'Meena Verma',
    role: 'Accessories Expert',
    date: 'Apr 14, 2025',
    readTime: '4 min read',
    image: 'https://static1.industrybuying.com/products/automotive-maintenance-and-accessories/2-wheeler-accessories/bike-accessories/AUT.BIK.39834448_1687519120656.webp',
    accent: '#111',
    featured: false,
  },
  {
    id: 5,
    category: 'Tech & Features',
    tag: 'Deep Dive',
    title: 'Hero i3S Technology Explained: Save Fuel Every Ride',
    excerpt: 'Idle Start-Stop System sounds simple, but the engineering behind it is surprisingly elegant. We explain how Hero\'s i3S works and exactly how much fuel it can save you annually.',
    author: 'Vikram Nair',
    role: 'Technical Writer',
    date: 'Apr 8, 2025',
    readTime: '6 min read',
    image: '/images/blog5.jpg',
    accent: '#FF0000',
    featured: false,
  },
  {
    id: 6,
    category: 'Maintenance',
    tag: 'DIY Guide',
    title: 'Chain Cleaning & Lubrication: The Complete Guide',
    excerpt: 'A clean, well-lubricated chain improves performance, fuel efficiency, and lifespan. Our step-by-step guide walks you through the full process with photos and expert tips.',
    author: 'Rajesh Kumar',
    role: 'Senior Technician',
    date: 'Apr 1, 2025',
    readTime: '8 min read',
    image: '/images/blog6.jpg',
    accent: '#111',
    featured: false,
  },
  {
    id: 7,
    category: 'New Launches',
    tag: 'Review',
    title: 'Hero Mavrick 440: One Month Ownership Report',
    excerpt: 'We\'ve put 2,000 km on the Mavrick 440 since launch. Real-world fuel efficiency, highway comfort, city maneuverability, and a few surprises—here\'s our honest take.',
    author: 'Priya Sharma',
    role: 'Product Specialist',
    date: 'Mar 22, 2025',
    readTime: '9 min read',
    image: '/images/blog7.jpg',
    accent: '#FF0000',
    featured: false,
  },
  {
    id: 8,
    category: 'Riding Tips',
    tag: 'Beginner',
    title: 'First 1,000 km on a New Bike: What You Must Do',
    excerpt: 'The break-in period is critical yet often ignored. Follow these engine, transmission, and tyre bedding-in tips to ensure your new Hero runs perfectly for years to come.',
    author: 'Arun Singh',
    role: 'Riding Coach',
    date: 'Mar 15, 2025',
    readTime: '5 min read',
    image: '/images/blog8.jpg',
    accent: '#111',
    featured: false,
  },
];

const tips = [
  { icon: '🔧', text: 'Service every 3,000 km or 3 months' },
  { icon: '🛞', text: 'Check tyre pressure every 2 weeks' },
  { icon: '⚡', text: 'Test battery health before monsoon season' },
  { icon: '🛢️', text: 'Use only Hero-recommended engine oil' },
];

function BlogCard({ post, index, large }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (large) {
    return (
      <div ref={ref} style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        border: '1.5px solid #eee', boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
        opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease', cursor: 'pointer',
      }} className="featured-card">
        {/* Image side */}
        <div style={{ position: 'relative', background: '#1a1a1a', minHeight: 320, overflow: 'hidden' }}>
          <img src={post.image} alt={post.title} onError={e => { e.target.style.display = 'none'; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75, position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)' }} />
          <div style={{ position: 'absolute', top: 20, left: 20 }}>
            <span style={{ background: '#FF0000', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', padding: '5px 12px', borderRadius: 20, textTransform: 'uppercase', fontFamily: "'Barlow'" }}>
              ★ Featured
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{post.category}</div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{post.author} · {post.readTime}</div>
            </div>
          </div>
        </div>
        {/* Content side */}
        <div style={{ padding: 'clamp(28px,5vw,40px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ background: '#fff0f0', color: '#FF0000', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 14, textTransform: 'uppercase' }}>{post.tag}</span>
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(24px,4vw,34px)', fontWeight: 900, color: '#0f0f0f', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 'clamp(14px,2.5vw,20px) 0 clamp(12px,2vw,16px)' }}>
              {post.title}
            </h2>
            <p style={{ fontSize: 'clamp(13px,2vw,15px)', color: '#666', lineHeight: 1.75 }}>{post.excerpt}</p>
          </div>
          <div style={{ marginTop: 28 }}>
            <div style={{ height: 1, background: '#f0f0f0', marginBottom: 20 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#111' }}>{post.author}</div>
                <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, marginTop: 2 }}>{post.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#aaa', fontWeight: 600 }}>{post.date}</div>
                <div style={{ fontSize: 11, color: '#FF0000', fontWeight: 700, marginTop: 2 }}>{post.readTime}</div>
              </div>
            </div>
            <button style={{ marginTop: 20, width: '100%', padding: '12px 0', background: '#0f0f0f', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, fontFamily: "'Barlow'", letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer' }}
              onMouseEnter={e => { e.target.style.background = '#FF0000'; }}
              onMouseLeave={e => { e.target.style.background = '#0f0f0f'; }}
            >
              Read Full Article →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: '1.5px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.5s ease ${index * 70}ms, transform 0.5s ease ${index * 70}ms`,
      cursor: 'pointer', display: 'flex', flexDirection: 'column',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 200, background: '#1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
        <img src={post.image} alt={post.title} onError={e => { e.target.style.display = 'none'; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'transform 0.4s ease' }}
          onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)` }} />
        <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>
          <span style={{ background: post.accent, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', padding: '3px 9px', borderRadius: 14, textTransform: 'uppercase' }}>{post.category}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
          <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)' }}>{post.tag}</span>
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: 'clamp(16px,3vw,22px)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(18px,3.5vw,22px)', fontWeight: 900, color: '#111', lineHeight: 1.18, letterSpacing: '-0.02em', marginBottom: 'clamp(8px,1.5vw,12px)' }}>
            {post.title}
          </h3>
          <p style={{ fontSize: 'clamp(12px,2vw,13px)', color: '#777', lineHeight: 1.7 }}>{post.excerpt.slice(0, 110)}…</p>
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 12, color: '#222' }}>{post.author}</div>
            <div style={{ fontSize: 11, color: '#bbb', marginTop: 1 }}>{post.date}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: post.accent }}>
            {post.readTime} →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featured = posts.find(p => p.featured);
  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch && !p.featured;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Barlow', sans-serif; }
        .cat-btn:hover { background: #FF0000 !important; color: #fff !important; border-color: #FF0000 !important; }
        .sub-btn:hover { background: #cc0000 !important; transform: translateY(-1px); }
        .blog-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important; transform: translateY(-3px) !important; }
        @media (max-width: 640px) {
          .hero-h1 { font-size: 40px !important; }
          .featured-card { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .stats-row { flex-direction: column !important; gap: 20px !important; }
          .search-bar { flex-direction: column !important; }
          .tips-grid { grid-template-columns: 1fr 1fr !important; }
          .newsletter-row { flex-direction: column !important; }
        }
        @media (max-width: 900px) {
          .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
          .featured-card { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        background: '#0f0f0f',
        backgroundImage: 'url(/images/bg1.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', padding: 'clamp(70px,15vw,120px) 5vw clamp(50px,10vw,80px)',
        color: '#fff', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 1 }} />
        {/* Decorative red vertical rule */}
        <div style={{ position: 'absolute', top: 0, left: '5vw', width: 3, height: '100%', background: 'linear-gradient(180deg, transparent, #FF0000 30%, #FF0000 70%, transparent)', zIndex: 2, opacity: 0.5 }} />
        <div style={{ position: 'relative', zIndex: 3, maxWidth: 860 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(14px,3vw,20px)' }}>
            <div style={{ width: 28, height: 2, background: '#FF0000' }} />
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(10px,2vw,13px)', fontWeight: 700, letterSpacing: '0.25em', color: '#ff4d4d', textTransform: 'uppercase' }}>HERO KNOWLEDGE HUB</span>
          </div>
          <h1 className="hero-h1" style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(42px,9vw,96px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-1.5px', marginBottom: 'clamp(18px,3vw,26px)' }}>
            RIDE SMARTER.<br /><span style={{ color: '#FF0000' }}>KNOW MORE.</span><br />RIDE BETTER.
          </h1>
          <p style={{ fontSize: 'clamp(14px,3vw,17px)', color: 'rgba(255,255,255,0.65)', fontWeight: 500, maxWidth: 500, lineHeight: 1.7, marginBottom: 'clamp(28px,5vw,40px)' }}>
            Tips, guides, reviews, and news — everything a Hero owner needs in one place.
          </p>
          {/* Search */}
          <div className="search-bar" style={{ display: 'flex', gap: 0, maxWidth: 520, background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <input
              type="text" placeholder="Search articles…" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: 'clamp(12px,2vw,15px) clamp(14px,2.5vw,20px)', border: 'none', outline: 'none', fontSize: 14, fontFamily: "'Barlow'", fontWeight: 500 }}
            />
            <button style={{ padding: '0 clamp(16px,3vw,24px)', background: '#FF0000', color: '#fff', border: 'none', fontSize: 'clamp(12px,2vw,14px)', fontWeight: 800, fontFamily: "'Barlow'", cursor: 'pointer', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              Search →
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="stats-row" style={{ position: 'relative', zIndex: 3, display: 'flex', gap: 'clamp(28px,6vw,52px)', marginTop: 'clamp(36px,7vw,56px)', paddingTop: 'clamp(24px,5vw,36px)', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
          {[['50+', 'Articles Published'], ['12K+', 'Monthly Readers'], ['8', 'Expert Authors'], ['Weekly', 'New Content']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(20px,4.5vw,28px)', fontWeight: 900, color: '#FF0000', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 'clamp(11px,2vw,12px)', color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section style={{ background: '#fff', borderBottom: '1.5px solid #eee', padding: '0 5vw', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button key={cat} className="cat-btn" onClick={() => setActiveCategory(cat)}
              style={{
                padding: 'clamp(14px,2vw,18px) clamp(14px,2.5vw,22px)',
                background: 'transparent', color: activeCategory === cat ? '#FF0000' : '#888',
                border: 'none', borderBottom: activeCategory === cat ? '3px solid #FF0000' : '3px solid transparent',
                fontSize: 'clamp(12px,2vw,14px)', fontWeight: 800, fontFamily: "'Barlow'",
                cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.02em', transition: 'color 0.2s',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      {featured && activeCategory === 'All' && !searchQuery && (
        <section style={{ background: '#f5f5f5', padding: 'clamp(48px,10vw,70px) 5vw clamp(24px,5vw,36px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(24px,4vw,32px)' }}>
              <div style={{ width: 5, height: 28, background: '#FF0000', borderRadius: 3 }} />
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(18px,3vw,22px)', fontWeight: 900, color: '#111', letterSpacing: '-0.02em' }}>Featured Article</span>
            </div>
            <BlogCard post={featured} large index={0} />
          </div>
        </section>
      )}

      {/* ── ALL POSTS GRID ── */}
      <section style={{ background: '#f5f5f5', padding: 'clamp(24px,5vw,40px) 5vw clamp(56px,12vw,80px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(24px,4vw,36px)', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 5, height: 28, background: '#111', borderRadius: 3 }} />
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(18px,3vw,22px)', fontWeight: 900, color: '#111', letterSpacing: '-0.02em' }}>
                {activeCategory === 'All' ? 'Latest Articles' : activeCategory}
              </span>
              <span style={{ background: '#FF0000', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 20, fontFamily: "'Barlow'" }}>{filtered.length}</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 28, fontWeight: 900, color: '#333', marginBottom: 8 }}>No articles found</div>
              <div style={{ fontSize: 15 }}>Try a different search term or category.</div>
            </div>
          ) : (
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(14px,2.5vw,24px)' }}>
              {filtered.map((post, i) => (
                <div key={post.id} className="blog-card" style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease', borderRadius: 16 }}>
                  <BlogCard post={post} index={i} />
                </div>
              ))}
            </div>
          )}

          {/* Load more */}
          {filtered.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 'clamp(36px,7vw,52px)' }}>
              <button style={{ padding: 'clamp(12px,2vw,16px) clamp(28px,5vw,48px)', background: 'transparent', color: '#111', border: '2px solid #111', borderRadius: 8, fontSize: 'clamp(12px,2vw,14px)', fontWeight: 800, fontFamily: "'Barlow'", cursor: 'pointer', letterSpacing: '0.8px', textTransform: 'uppercase', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.target.style.background = '#111'; e.target.style.color = '#fff'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#111'; }}
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── QUICK TIPS STRIP ── */}
      <section style={{ background: '#111', padding: 'clamp(40px,8vw,60px) 5vw' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'clamp(28px,5vw,40px)' }}>
            <div style={{ width: 5, height: 26, background: '#FF0000', borderRadius: 3 }} />
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(18px,3.5vw,24px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Quick Maintenance Tips</span>
          </div>
          <div className="tips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(12px,2vw,20px)' }}>
            {tips.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 'clamp(16px,3vw,24px)', borderTop: '3px solid #FF0000' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{t.icon}</div>
                <div style={{ fontSize: 'clamp(13px,2vw,14px)', color: 'rgba(255,255,255,0.75)', fontWeight: 600, lineHeight: 1.6 }}>{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={{ background: '#FF0000', padding: 'clamp(48px,10vw,72px) 5vw' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="newsletter-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(28px,6vw,60px)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(10px,2vw,12px)', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 10 }}>— STAY IN THE LOOP —</div>
              <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(28px,6vw,56px)', fontWeight: 900, color: '#fff', lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 10 }}>
                GET WEEKLY<br />BIKE TIPS
              </h2>
              <p style={{ fontSize: 'clamp(13px,2vw,15px)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, maxWidth: 360 }}>
                Join 12,000+ Hero owners. Get servicing reminders, riding guides, and launch news straight to your inbox.
              </p>
            </div>
            <div style={{ flex: 1, maxWidth: 440, minWidth: 260 }}>
              {subscribed ? (
                <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 14, padding: 'clamp(24px,4vw,32px)', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 6 }}>You're subscribed!</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>First issue lands next Monday.</div>
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 14, padding: 'clamp(24px,4vw,32px)', boxShadow: '0 16px 48px rgba(0,0,0,0.15)' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Your Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: 'clamp(11px,2vw,14px) clamp(12px,2vw,16px)', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, fontFamily: "'Barlow'", outline: 'none', marginBottom: 12 }} />
                  <button className="sub-btn"
                    onClick={() => { if (email.includes('@')) setSubscribed(true); }}
                    style={{ width: '100%', padding: 'clamp(12px,2vw,15px)', background: '#FF0000', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, fontFamily: "'Barlow'", cursor: 'pointer', letterSpacing: '0.8px', textTransform: 'uppercase', transition: 'all 0.2s ease' }}>
                    Subscribe Free →
                  </button>
                  <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 10, fontWeight: 600 }}>No spam. Unsubscribe anytime.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}