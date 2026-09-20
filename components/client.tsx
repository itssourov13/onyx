'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ContentEntry } from '@/lib/content';
import { nav, securityNav, systemNav } from '@/lib/data';
import { Icon } from './icons';
import { CommandPalette } from './command-palette';

export function ShellControls({ entries }: { entries: ContentEntry[] }){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const [cmd,setCmd]=useState(false);
  const menuToggleRef=useRef<HTMLButtonElement>(null);
  const searchToggleRef=useRef<HTMLButtonElement>(null);
  const menuReturnFocusRef=useRef<HTMLElement | null>(null);
  const commandReturnFocusRef=useRef<HTMLElement | null>(null);

  useEffect(()=>{
    const fn=(e:KeyboardEvent)=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setCmd(true);setOpen(false);}
      if(e.key==='Escape'){setOpen(false);setCmd(false);}
    };
    window.addEventListener('keydown',fn);
    return()=>window.removeEventListener('keydown',fn);
  },[]);

  useEffect(()=>{
    document.body.style.overflow=open||cmd?'hidden':'';
    document.body.dataset.menuOpen=open?'true':'';
    return()=>{document.body.style.overflow='';delete document.body.dataset.menuOpen;};
  },[open,cmd]);

  const openMenu=()=>{ menuReturnFocusRef.current=document.activeElement instanceof HTMLElement ? document.activeElement : menuToggleRef.current; setOpen(true); setCmd(false); };
  const closeMenu=()=>setOpen(false);
  const openCommand=()=>{ commandReturnFocusRef.current=document.activeElement instanceof HTMLElement ? document.activeElement : searchToggleRef.current; setCmd(true); setOpen(false); };
  const closeCommand=()=>setCmd(false);

  useEffect(()=>{
    if(open){
      const first=window.document.querySelector<HTMLElement>('#mobile-navigation a, #mobile-navigation button');
      first?.focus();
      return;
    }
    if(!cmd) menuReturnFocusRef.current?.focus();
    if(!cmd) menuReturnFocusRef.current=null;
  },[open,cmd]);

  useEffect(()=>{
    if(cmd) return;
    commandReturnFocusRef.current?.focus();
    commandReturnFocusRef.current=null;
  },[cmd]);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
  const activeSecurity = isActive('/security');
  const activeSystem = systemNav.some(([,href]) => isActive(href));
  const activeExploreOverflow = nav.slice(6).some(([,href]) => isActive(href));
  return <>
    <nav className="nav-links" aria-label="Primary">
      {nav.slice(0,6).map(([label,href])=><Link key={href} href={href} className={`nav-link ${isActive(href)?'active':''}`}>{label}</Link>)}
      <details className="nav-more">
        <summary className={`nav-link nav-more-summary ${activeSecurity || activeSystem || activeExploreOverflow ? 'active' : ''}`}>More</summary>
        <div className="nav-more-panel">
          <div className="nav-more-group"><span className="eyebrow">Explore</span>{nav.slice(6).map(([label,href])=><Link key={href} href={href} className={isActive(href)?'active':''}>{label}</Link>)}</div>
          <div className="nav-more-group"><span className="eyebrow">System</span>{systemNav.map(([label,href])=><Link key={href} href={href} className={isActive(href)?'active':''}>{label}</Link>)}</div>
          <div className="nav-more-group"><span className="eyebrow">Cybersecurity</span>{securityNav.map(([label,href])=><Link key={href} href={href} className={isActive(href)?'active':''}>{label}</Link>)}</div>
        </div>
      </details>
    </nav>
    <div className="nav-actions">
      <button ref={searchToggleRef} className="icon-button search-toggle" aria-label="Open command search" onClick={openCommand}><Icon name="search"/></button>
      <button ref={menuToggleRef} id="mobile-menu-toggle" className="icon-button menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>open ? closeMenu() : openMenu()}><Icon name={open?'close':'menu'}/></button>
    </div>
    {open && <div className="mobile-menu-layer">
      <button className="mobile-menu-backdrop" aria-label="Close menu" onClick={closeMenu}/>
      <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation" onKeyDown={(event)=>{
          if(event.key!=='Tab') return;
          const focusables=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a,button:not([disabled])'));
          if(!focusables.length) return;
          const first=focusables[0]; const last=focusables[focusables.length-1];
          if(event.shiftKey && document.activeElement===first){ event.preventDefault(); last.focus(); }
          else if(!event.shiftKey && document.activeElement===last){ event.preventDefault(); first.focus(); }
        }}>
        <div className="mobile-menu-head"><div><div className="eyebrow">Navigation</div><p className="mono muted tiny">LOCAL // DEMO ENVIRONMENT</p></div><span className="tag mono">FULL ROUTE MAP</span></div>
        <div className="mobile-menu-section"><div className="mobile-menu-section-head"><span className="eyebrow">Explore</span><span className="mono tiny muted">{nav.length} ROUTES</span></div><div className="mobile-menu-list">{nav.map(([label,href])=><Link onClick={closeMenu} key={href} href={href} className={isActive(href)?'active':''}>{label}<span className="muted mono">↗</span></Link>)}</div></div>
        <div className="mobile-menu-section"><div className="mobile-menu-section-head"><span className="eyebrow">System</span><span className="mono tiny muted">{systemNav.length} ROUTES</span></div><div className="mobile-menu-list">{systemNav.map(([label,href])=><Link onClick={closeMenu} key={`system:${href}`} href={href} className={isActive(href)?'active':''}>{label}<span className="muted mono">↗</span></Link>)}</div></div>
        <div className="mobile-menu-section"><div className="mobile-menu-section-head"><span className="eyebrow">Cybersecurity</span><span className="mono tiny muted">{securityNav.length} MODULES</span></div><div className="mobile-menu-list security-nav-list">{securityNav.map(([label,href])=><Link onClick={closeMenu} key={href} href={href} className={isActive(href)?'active':''}>{label}<span className="muted mono">↗</span></Link>)}</div></div>
        <div className="divider"/>
        <button className="btn btn-ghost mobile-command" onClick={()=>{closeMenu();openCommand()}}><Icon name="search"/> Command search <span className="mono tiny">⌘K</span></button>
        <p className="mobile-menu-note mono">MENU // FULL IA · BACKDROP BLUR · SCROLL LOCK</p>
      </nav>
    </div>}
    {cmd && <CommandPalette onClose={closeCommand} entries={entries}/>} 
  </>;
}
