import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ContentEntry } from '@/lib/content';
import { demoOnion, nav, securityNav, systemNav } from '@/lib/data';
import { ShellControls } from './client';
import { Icon } from './icons';

export function Header({ entries = [] }: { entries?: ContentEntry[] }){
  return <header className="topbar"><div className="container nav">
    <Link href="/" className="brand"><span className="brand-mark"><Icon name="globe" size={17}/></span><span><span className="brand-name">ONYX</span><span className="brand-sub mono">privacy research terminal</span></span></Link>
    <ShellControls entries={entries}/>
  </div></header>;
}

export function Footer(){
  return <footer className="footer"><div className="container footer-grid">
    <div><div className="eyebrow">Demo environment</div><p className="muted small">This interface is a fictional privacy research portal. Onion addresses, network metrics and verification data are simulated for design purposes.</p><p className="mono muted" style={{fontSize:'.72rem',overflowWrap:'anywhere'}}>DEMO ADDRESS // {demoOnion}</p></div>
    <div><div className="footer-link-groups"><div><div className="eyebrow">Explore</div><div className="footer-links">{nav.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</div></div><div><div className="eyebrow">System</div><div className="footer-links">{systemNav.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</div></div><div><div className="eyebrow">Security</div><div className="footer-links">{securityNav.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</div></div></div><div className="footer-links" style={{marginTop:12}}><span>Next.js App Router</span><span>•</span><span>MDX corpus</span><span>•</span><span>Demo data only</span></div></div>
  </div></footer>;
}

export function Layout({children, entries = []}:{children:ReactNode; entries?: ContentEntry[]}){ return <div className="site-shell"><Header entries={entries}/>{children}<Footer/></div>; }

export function PageHero({eyebrow,title,children}:{eyebrow:string;title:string;children:ReactNode}){
  return <div className="page-hero"><div className="container"><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1><div className="page-intro">{children}</div></div></div>;
}

export function StatusPill({text='ONLINE'}:{text?:string}){
  const online=text==='ONLINE'||text==='OPERATIONAL'||text==='STABLE';
  const warning=text==='DEGRADED'||text==='MAINTENANCE'||text==='WATCH';
  const tone=warning?'warning':online?'online':'neutral';
  return <span className={`tag status-tag ${tone}`}><span className="signal"><i/>{text}</span></span>;
}
