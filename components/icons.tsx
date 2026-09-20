import type React from 'react';

export function Icon({name,size=18}:{name:string;size?:number}){
  const p={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  const common=(children:React.ReactNode)=><svg {...p} aria-hidden="true">{children}</svg>;
  if(name==='menu') return common(<><path d="M4 7h16M4 12h16M4 17h16"/></>);
  if(name==='close') return common(<><path d="M6 6l12 12M18 6 6 18"/></>);
  if(name==='search') return common(<><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>);
  if(name==='arrow') return common(<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>);
  if(name==='lock') return common(<><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>);
  if(name==='globe') return common(<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>);
  if(name==='doc') return common(<><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5M9 12h6M9 16h6"/></>);
  return common(<circle cx="12" cy="12" r="8"/>);
}
