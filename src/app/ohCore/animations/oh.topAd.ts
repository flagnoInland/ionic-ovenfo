import { trigger, animate, transition, style } from '@angular/animations';

export const ohTopAd =
    trigger(
      'ohTopAd',
      [
        transition(
          ':enter', [
            style({transform: 'translateY(-100%)', opacity: 0}),
            animate('500ms ease-in-out', style({transform: 'translateY(0)', 'opacity': 1}))
          ]
        ),
        transition(
          ':leave', [
            style({transform: 'translateY(0)', 'opacity': 1}),
            animate('500ms ease-in-out', style({transform: 'translateY(+100%)', 'opacity': 0}))
          ]
        )
      ]
    );