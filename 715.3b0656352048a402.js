"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[715],{9715:(C,u,o)=>{o.r(u),o.d(u,{ProfileComponent:()=>v});var l=o(467),c=o(2185),e=o(4438),_=o(4441);const a=n=>["/profile/user",n],g=n=>["/user/settings",n];function d(n,s){if(1&n&&(e.j41(0,"a",1)(1,"div",5)(2,"div",6),e.nrm(3,"img",7),e.k0s(),e.j41(4,"div",8)(5,"p"),e.EFF(6),e.k0s(),e.j41(7,"small"),e.EFF(8),e.k0s()()()()),2&n){const t=e.XpG();e.Y8G("routerLink",e.eq3(4,a,t.user.uid)),e.R7$(3),e.FS9("src",t.user.photoURL||"/assets/icon/user_icon.svg",e.B4B),e.R7$(3),e.JRh(t.formattedName),e.R7$(2),e.JRh(t.user.email)}}function p(n,s){if(1&n&&(e.j41(0,"div",5)(1,"div",6),e.nrm(2,"img",7),e.k0s(),e.j41(3,"div",8)(4,"p"),e.EFF(5),e.k0s(),e.j41(6,"small"),e.EFF(7),e.k0s()()()),2&n){const t=e.XpG();e.R7$(2),e.FS9("src",(null==t.user?null:t.user.photoURL)||"/assets/icon/user_icon.svg",e.B4B),e.R7$(3),e.JRh(t.formattedName),e.R7$(2),e.JRh(null==t.user?null:t.user.email)}}function f(n,s){if(1&n&&(e.j41(0,"button",2),e.nrm(1,"img",9),e.j41(2,"p"),e.EFF(3,"Configuraci\xf3n"),e.k0s()()),2&n){const t=e.XpG();e.Y8G("routerLink",e.eq3(1,g,t.user.uid))}}function h(n,s){if(1&n&&(e.j41(0,"button",10),e.nrm(1,"img",11),e.j41(2,"p"),e.EFF(3,"Mi perfil"),e.k0s()()),2&n){const t=e.XpG();e.Y8G("routerLink",e.eq3(1,a,null==t.user?null:t.user.uid))}}let v=(()=>{var n;class s{constructor(i,r){this.authService=i,this.router=r,this.user=null,this.formattedName=""}ngOnInit(){this.authService.currentUser$.subscribe(i=>{if(i){this.user=i;const{name:r,lastname:m=""}=i;this.formattedName=`${r} ${m.split(" ")[0]}`}else this.authService.getCurrentUser()})}signOut(){var i=this;return(0,l.A)(function*(){yield i.authService.signOut().then(()=>{i.router.navigate(["/auth/login"])}).catch(r=>{console.error("Error logging out:",r)})})()}}return(n=s).\u0275fac=function(i){return new(i||n)(e.rXU(_.u),e.rXU(c.Ix))},n.\u0275cmp=e.VBU({type:n,selectors:[["app-profile"]],standalone:!0,features:[e.aNF],decls:10,vars:2,consts:[[1,"content-menu"],["routerLinkActive","active",3,"routerLink"],["routerLinkActive","active",1,"menu-item",3,"routerLink"],[1,"menu-item",3,"click"],["src","/assets/icon/signOut.svg","alt","settings-icon",1,"menu-icon"],[1,"card"],[1,"card-img"],["alt","user-img",1,"user-icon",3,"src"],[1,"card-info"],["src","/assets/icon/settings.svg","alt","settings-icon",1,"menu-icon"],["routerLinkActive","active",1,"user-menu-item",3,"routerLink"],["src","/assets/icon/profile.svg","alt","settings-icon",1,"menu-icon"]],template:function(i,r){1&i&&(e.j41(0,"div",0),e.DNE(1,d,9,6,"a",1)(2,p,8,3)(3,f,4,3,"button",2)(4,h,4,3),e.j41(5,"button",3),e.bIt("click",function(){return r.signOut()}),e.nrm(6,"img",4),e.j41(7,"p"),e.EFF(8,"Cerrar sesi\xf3n"),e.k0s()()(),e.nrm(9,"hr")),2&i&&(e.R7$(),e.vxM(1,r.user&&"admin"===r.user.role?1:2),e.R7$(2),e.vxM(3,r.user&&"admin"===r.user.role?3:4))},dependencies:[c.Wk],styles:[".content-menu[_ngcontent-%COMP%]{margin-bottom:4rem;animation:fadeInBackground .2s ease-in-out forwards}.content-menu[_ngcontent-%COMP%]   .user-menu-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:1rem;height:1rem}.menu-item[_ngcontent-%COMP%], .user-menu-item[_ngcontent-%COMP%]{display:flex;padding:10px;width:100%;text-decoration:none;align-items:center;gap:1rem}.menu-item[_ngcontent-%COMP%]:hover, .user-menu-item[_ngcontent-%COMP%]:hover{background-color:#ddd}.card[_ngcontent-%COMP%]{align-items:center;gap:10px;display:flex;padding:10px;box-shadow:0 .5rem 1rem #0003;border-radius:1rem;margin:.5rem .5rem 1rem}.card-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:50%}.user-icon[_ngcontent-%COMP%]{width:40px;height:40px;object-fit:cover}"]}),s})()}}]);