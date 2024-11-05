"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[773],{5773:(I,f,t)=>{t.r(f),t.d(f,{ROUTES:()=>R});var h=t(9842),l=t(4438),G=t(6335),P=t(2185),g=t(1203),m=t(6354),M=t(6697);t(2214);const A=(0,m.T)(n=>!!n);let o=(()=>{var n;class d{constructor(s,v){(0,h.A)(this,"router",void 0),(0,h.A)(this,"auth",void 0),(0,h.A)(this,"canActivate",(C,p)=>{const r=C.data.authGuardPipe||(()=>A);return(0,G.kQ)(this.auth).pipe((0,M.s)(1),r(C,p),(0,m.T)(e=>"boolean"==typeof e?e:Array.isArray(e)?this.router.createUrlTree(e):this.router.parseUrl(e)))}),this.router=s,this.auth=v}}return n=d,(0,h.A)(d,"\u0275fac",function(s){return new(s||n)(l.KVO(P.Ix),l.KVO(G.Nj))}),(0,h.A)(d,"\u0275prov",l.jDH({token:n,factory:n.\u0275fac,providedIn:"any"})),d})();var U=t(4441);const i=(n,d)=>{const u=(0,l.WQX)(U.u),s=(0,l.WQX)(P.Ix);return u.currentUser$.pipe((0,m.T)(v=>!(!v||!v.role.includes("admin"))||(s.navigate(["/home"]),!1)))},a=()=>{return n=["/auth/login"],(0,g.F)(A,(0,m.T)(d=>d||n));var n},R=[{path:"auth",loadChildren:()=>t.e(634).then(t.bind(t,5634)).then(n=>n.AUTH_ROUTES)},{path:"home",canActivate:[o],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(557),t.e(788),t.e(667),t.e(132),t.e(603),t.e(76),t.e(228)]).then(t.bind(t,4850)).then(n=>n.HomeComponent)},{path:"agenda",canActivate:[o,i],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(557),t.e(788),t.e(603),t.e(364)]).then(t.bind(t,9364)).then(n=>n.AgendaComponent)},{path:"agenda/new-event",canActivate:[o],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(557),t.e(788),t.e(572),t.e(667),t.e(997)]).then(t.bind(t,5997)).then(n=>n.NewEventComponent)},{path:"agenda/new-event/:date",canActivate:[o],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(557),t.e(788),t.e(572),t.e(667),t.e(997)]).then(t.bind(t,5997)).then(n=>n.NewEventComponent)},{path:"users",canActivate:[o],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(76),t.e(988)]).then(t.bind(t,6988)).then(n=>n.UsersComponent)},{path:"users/:id",canActivate:[o,i],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(557),t.e(342)]).then(t.bind(t,1342)).then(n=>n.UserComponent)},{path:"profile",canActivate:[o],data:{authGuardPipe:a},loadComponent:()=>t.e(715).then(t.bind(t,9715)).then(n=>n.ProfileComponent)},{path:"not-found",canActivate:[o],data:{authGuardPipe:a},loadComponent:()=>t.e(13).then(t.bind(t,13)).then(n=>n.NotFoundComponent)},{path:"profile/user/:id",canActivate:[o],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(557),t.e(132),t.e(695)]).then(t.bind(t,9695)).then(n=>n.UserProfileComponent)},{path:"edit-user/:id",canActivate:[o,i],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(557),t.e(572),t.e(132),t.e(31)]).then(t.bind(t,2375)).then(n=>n.EditUserComponent)},{path:"user/settings/:id",canActivate:[o,i],data:{authGuardPipe:a},loadComponent:()=>Promise.all([t.e(807),t.e(788),t.e(572),t.e(667),t.e(194)]).then(t.bind(t,1412)).then(n=>n.UserSettingsComponent)},{path:"**",redirectTo:"home",pathMatch:"full"}]}}]);