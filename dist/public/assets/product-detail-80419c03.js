import{g as W,a as L,$ as P,S as V,f as C}from"./free-mode-d251b1d1.js";import{T as H}from"./thumbs-a96dec08.js";function N({swiper:e,extendParams:S,on:y,emit:x}){const r=W(),m=L();e.keyboard={enabled:!1},S({keyboard:{enabled:!1,onlyInViewport:!0,pageUpDown:!0}});function g(A){if(!e.enabled)return;const{rtlTranslate:d}=e;let t=A;t.originalEvent&&(t=t.originalEvent);const o=t.keyCode||t.charCode,k=e.params.keyboard.pageUpDown,a=k&&o===33,l=k&&o===34,f=o===37,s=o===39,c=o===38,u=o===40;if(!e.allowSlideNext&&(e.isHorizontal()&&s||e.isVertical()&&u||l)||!e.allowSlidePrev&&(e.isHorizontal()&&f||e.isVertical()&&c||a))return!1;if(!(t.shiftKey||t.altKey||t.ctrlKey||t.metaKey)&&!(r.activeElement&&r.activeElement.nodeName&&(r.activeElement.nodeName.toLowerCase()==="input"||r.activeElement.nodeName.toLowerCase()==="textarea"))){if(e.params.keyboard.onlyInViewport&&(a||l||f||s||c||u)){let v=!1;if(e.$el.parents(`.${e.params.slideClass}`).length>0&&e.$el.parents(`.${e.params.slideActiveClass}`).length===0)return;const w=e.$el,D=w[0].clientWidth,$=w[0].clientHeight,K=m.innerWidth,U=m.innerHeight,n=e.$el.offset();d&&(n.left-=e.$el[0].scrollLeft);const E=[[n.left,n.top],[n.left+D,n.top],[n.left,n.top+$],[n.left+D,n.top+$]];for(let b=0;b<E.length;b+=1){const i=E[b];if(i[0]>=0&&i[0]<=K&&i[1]>=0&&i[1]<=U){if(i[0]===0&&i[1]===0)continue;v=!0}}if(!v)return}e.isHorizontal()?((a||l||f||s)&&(t.preventDefault?t.preventDefault():t.returnValue=!1),((l||s)&&!d||(a||f)&&d)&&e.slideNext(),((a||f)&&!d||(l||s)&&d)&&e.slidePrev()):((a||l||c||u)&&(t.preventDefault?t.preventDefault():t.returnValue=!1),(l||u)&&e.slideNext(),(a||c)&&e.slidePrev()),x("keyPress",o)}}function p(){e.keyboard.enabled||(P(r).on("keydown",g),e.keyboard.enabled=!0)}function h(){e.keyboard.enabled&&(P(r).off("keydown",g),e.keyboard.enabled=!1)}y("init",()=>{e.params.keyboard.enabled&&p()}),y("destroy",()=>{e.keyboard.enabled&&h()}),Object.assign(e.keyboard,{enable:p,disable:h})}function z(){const e=new V(".cart-swiper-pagination",{loop:!1,keyboard:!0,spaceBetween:10,slidesPerView:4,freeMode:!0,watchSlidesProgress:!0,modules:[H,N,C]});new V(".cart-swiper",{modules:[H,N,C],keyboard:!0,loop:!0,spaceBetween:24,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},thumbs:{swiper:e}})}z();