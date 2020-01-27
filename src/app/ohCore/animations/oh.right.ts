import { trigger, animate, transition, style } from '@angular/animations';

export const ohRight =
    trigger(
      'ohRight',
      [
        transition(
          ':enter', [
            //style({transform: 'translateX(100%)', opacity: 0, top: 0, position: "absolute"}),
            style({transform: 'translateX(0)', opacity: 0}),
            animate('300ms ease-in-out', style({transform: 'translateX(-100%)', 'opacity': 1}))
          ]
        ),
        transition(
          ':leave', [
            //style({transform: 'translateX(0)', 'opacity': 1, top: 0, position: "absolute"}),
            style({transform: 'translateX(-100%)', 'opacity': 1}),
            animate('300ms ease-in-out', style({transform: 'translateX(0)', 'opacity': 0}))
          ]
        )
      ]
    );